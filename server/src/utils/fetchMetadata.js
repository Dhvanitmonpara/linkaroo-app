import scraper from 'metadata-scraper';

async function fetchMetadata(url) {
  try {
    const metadata = await scraper(url);

    // Extract title and description, provide default values if they are missing
    const title = metadata.title || 'No title found';
    const description = metadata.description || 'No description found';

    return { title, description };
  } catch (error) {
    console.error('Error scraping metadata:', error);
    return { title: '', description: '' };
  }
}

export default fetchMetadata