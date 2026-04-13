/**
 * Script to publish all draft property documents in Sanity
 *
 * Usage:
 * 1. Get a write token from: https://sanity.io/manage/project/6ostes35/api#tokens
 * 2. Run: SANITY_TOKEN=your_token_here node scripts/publish-all-properties.mjs
 */

const projectId = '6ostes35';
const dataset = 'production';
const apiVersion = '2024-01-01';

const token = process.env.SANITY_TOKEN;

if (!token) {
  console.error('Error: SANITY_TOKEN environment variable is required');
  console.log('\nTo get a token:');
  console.log('1. Go to https://sanity.io/manage/project/6ostes35/api#tokens');
  console.log('2. Create a new token with "Editor" permissions');
  console.log('3. Run: SANITY_TOKEN=your_token node scripts/publish-all-properties.mjs');
  process.exit(1);
}

const baseUrl = `https://${projectId}.api.sanity.io/v${apiVersion}/data`;

async function fetchDraftProperties() {
  const query = encodeURIComponent('*[_type == "property" && _id in path("drafts.**")]{_id, title}');
  const url = `${baseUrl}/query/${dataset}?query=${query}`;

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch drafts: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.result;
}

async function publishDocuments(draftIds) {
  // Create mutations to publish each document
  const mutations = draftIds.map(draftId => {
    // Extract the actual ID without "drafts." prefix
    const publishedId = draftId.replace('drafts.', '');

    return {
      patch: {
        id: draftId,
        set: { _id: publishedId },
      }
    };
  });

  // Actually, publishing requires a different approach in Sanity
  // We need to use the publish action
  const publishMutations = draftIds.map(draftId => {
    const publishedId = draftId.replace('drafts.', '');
    return { id: publishedId, draftId };
  });

  // Process in batches of 10
  const batchSize = 10;
  let published = 0;

  for (let i = 0; i < publishMutations.length; i += batchSize) {
    const batch = publishMutations.slice(i, i + batchSize);

    // For each document in the batch, we need to:
    // 1. Fetch the draft
    // 2. Create/update the published version
    // 3. Delete the draft

    for (const { id, draftId } of batch) {
      try {
        // Fetch the draft document
        const draftQuery = encodeURIComponent(`*[_id == "${draftId}"][0]`);
        const draftResponse = await fetch(`${baseUrl}/query/${dataset}?query=${draftQuery}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const draftData = await draftResponse.json();
        const draft = draftData.result;

        if (!draft) {
          console.log(`  Skipping ${draftId} - not found`);
          continue;
        }

        // Create the published version (remove drafts. prefix from _id)
        const publishedDoc = { ...draft, _id: id };

        // Use createOrReplace for the published version, then delete the draft
        const mutations = [
          { createOrReplace: publishedDoc },
          { delete: { id: draftId } }
        ];

        const mutateResponse = await fetch(`${baseUrl}/mutate/${dataset}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ mutations }),
        });

        if (!mutateResponse.ok) {
          const error = await mutateResponse.text();
          console.error(`  Failed to publish ${draft.title || id}: ${error}`);
        } else {
          published++;
          console.log(`  ✓ Published: ${draft.title || id}`);
        }
      } catch (err) {
        console.error(`  Error publishing ${id}: ${err.message}`);
      }
    }

    console.log(`Progress: ${Math.min(i + batchSize, publishMutations.length)}/${publishMutations.length}`);
  }

  return published;
}

async function main() {
  console.log('Fetching draft properties...\n');

  const drafts = await fetchDraftProperties();

  if (drafts.length === 0) {
    console.log('No draft properties found. All properties may already be published.');
    return;
  }

  console.log(`Found ${drafts.length} draft properties to publish.\n`);
  console.log('Publishing...\n');

  const draftIds = drafts.map(d => d._id);
  const publishedCount = await publishDocuments(draftIds);

  console.log(`\n✓ Done! Published ${publishedCount} of ${drafts.length} properties.`);
}

main().catch(err => {
  console.error('Script failed:', err);
  process.exit(1);
});
