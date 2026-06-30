import { getSequelize, models } from '../index.js';
import createLogger from '../logger/winston.js';

const logger = createLogger('db-seed');

const dummyBlogs = [
  {
    title: 'The Future of Precision Agriculture',
    slug: 'precision-agriculture-future',
    excerpt: 'Precision agriculture is rapidly reshaping the farming landscape, bringing data-driven decisions to the modern farmer.',
    content: '<p>Precision agriculture uses technology to ensure that crops and soil receive exactly what they need for optimum health and productivity. The goal is to ensure profitability, sustainability, and protection of the environment. <strong>KMC provides advanced precision tools</strong> for our farmers to track weather, soil moisture, and crop health.</p>',
    featured_image: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?q=80&w=1000&auto=format&fit=crop',
    author: 'Dr. Ravi Sharma',
    status: 'published',
    tags: ['Technology', 'Farming', 'Innovation'],
    views: 124
  },
  {
    title: 'Managing Soil Health for Better Yields',
    slug: 'managing-soil-health',
    excerpt: 'Healthy soil is the absolute foundation of a successful crop. Learn how to maintain and improve your soil quality.',
    content: '<p>Soil health is defined as the continued capacity of soil to function as a vital living ecosystem that sustains plants, animals, and humans. Incorporating organic matter, reducing tillage, and utilizing cover crops are all excellent ways to boost soil vitality.</p><blockquote>"Take care of the soil, and it will take care of the crop."</blockquote>',
    featured_image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=1000&auto=format&fit=crop',
    author: 'AgriTeam',
    status: 'published',
    tags: ['Soil', 'Sustainability'],
    views: 342
  },
  {
    title: 'Top 5 Fertilizer Strategies for 2026',
    slug: 'fertilizer-strategies-2026',
    excerpt: 'Maximize your yield and minimize costs with these top fertilizer application strategies for the upcoming season.',
    content: '<p>Fertilizer costs can heavily impact a farm\'s bottom line. By employing strategies such as <strong>split applications, variable rate technology, and precision timing</strong>, farmers can drastically improve nutrient uptake efficiency and reduce waste.</p>',
    featured_image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=1000&auto=format&fit=crop',
    author: 'KMC Expert',
    status: 'published',
    tags: ['Fertilizer', 'Yield', 'Tips'],
    views: 89
  }
];

const dummyStories = [
  {
    farmer_name: 'Rajesh Kumar',
    district: 'Anantapur',
    crop: 'Groundnut',
    before_yield: 500,
    after_yield: 750,
    description: 'After implementing KMC\'s soil health recommendations and adjusting fertilization timing, Rajesh saw a massive 50% increase in his groundnut yield in just one season.',
    image: 'https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?q=80&w=600&auto=format&fit=crop',
    status: 'published'
  },
  {
    farmer_name: 'Lakshmi Narayana',
    district: 'Guntur',
    crop: 'Cotton',
    before_yield: 800,
    after_yield: 1100,
    description: 'KMC\'s early-warning pest management strategies saved Lakshmi\'s cotton crop from severe damage, resulting in her highest quality yield in 5 years.',
    image: 'https://images.unsplash.com/photo-1599423300746-b62533397364?q=80&w=600&auto=format&fit=crop',
    status: 'published'
  },
  {
    farmer_name: 'Subba Rao',
    district: 'Krishna',
    crop: 'Paddy',
    before_yield: 1800,
    after_yield: 2400,
    description: 'By switching to KMC-recommended premium seeds and strictly following a precision irrigation schedule, Subba Rao significantly boosted his paddy production and reduced water waste.',
    image: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?q=80&w=600&auto=format&fit=crop',
    status: 'published'
  }
];

const seedDatabase = async () => {
  try {
    const sequelize = getSequelize();
    await sequelize.authenticate();
    logger.info('Connection established successfully.');
    
    // Check if tables exist, sync if they don't
    await sequelize.sync({ alter: true });
    
    const { Blog, SuccessStory } = models;

    // Seed Blogs
    for (const blogData of dummyBlogs) {
      const [blog, created] = await Blog.findOrCreate({
        where: { slug: blogData.slug },
        defaults: blogData
      });
      if (created) {
        logger.info(`Created blog: ${blog.title}`);
      }
    }

    // Seed Success Stories
    for (const storyData of dummyStories) {
      const [story, created] = await SuccessStory.findOrCreate({
        where: { farmer_name: storyData.farmer_name, crop: storyData.crop },
        defaults: storyData
      });
      if (created) {
        logger.info(`Created success story for: ${story.farmer_name}`);
      }
    }

    logger.info('Database seeding completed successfully.');
    process.exit(0);
  } catch (error) {
    logger.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
