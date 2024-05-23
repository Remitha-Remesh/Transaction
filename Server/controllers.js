const axios = require('axios');
const Product = require('./models');

const initializeDatabase = async (req, res) => {
  try {
    const { data } = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    await Product.deleteMany(); // Clear existing data
    await Product.insertMany(data); // Insert new data
    res.status(200).send('Database initialized successfully');
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const listTransactions = async (req, res) => {
  try {
    const { search, page = 1, perPage = 10, month } = req.query;
    const query = {
      dateOfSale: { $regex: new RegExp(`-${month.padStart(2, '0')}-`, 'i') },
    };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { price: { $regex: search, $options: 'i' } },
      ];
    }

    const transactions = await Product.find(query)
      .skip((page - 1) * perPage)
      .limit(parseInt(perPage));

    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getStatistics = async (req, res) => {
  try {
    const { month } = req.query;
    const regex = new RegExp(`-${month.padStart(2, '0')}-`, 'i');

    const totalSaleAmount = await Product.aggregate([
      { $match: { dateOfSale: { $regex: regex } } },
      { $group: { _id: null, total: { $sum: '$price' } } },
    ]);

    const totalSoldItems = await Product.countDocuments({
      dateOfSale: { $regex: regex },
      sold: true,
    });

    const totalNotSoldItems = await Product.countDocuments({
      dateOfSale: { $regex: regex },
      sold: false,
    });

    res.status(200).json({
      totalSaleAmount: totalSaleAmount[0]?.total || 0,
      totalSoldItems,
      totalNotSoldItems,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getBarChartData = async (req, res) => {
  try {
    const { month } = req.query;
    const regex = new RegExp(`-${month.padStart(2, '0')}-`, 'i');

    const priceRanges = [
      [0, 100],
      [101, 200],
      [201, 300],
      [301, 400],
      [401, 500],
      [501, 600],
      [601, 700],
      [701, 800],
      [801, 900],
      [901, Number.MAX_SAFE_INTEGER],
    ];

    const priceRangeCounts = await Promise.all(
      priceRanges.map(async ([min, max]) => {
        const count = await Product.countDocuments({
          dateOfSale: { $regex: regex },
          price: { $gte: min, $lt: max },
        });
        return { range: `${min}-${max}`, count };
      })
    );

    res.status(200).json(priceRangeCounts);
  }catch (error) {
    res.status(500).send(error.message);
  }
};

const getPieChartData = async (req, res) => {
  try {
    const { month } = req.query;
    const regex = new RegExp(`-${month.padStart(2, '0')}-`, 'i');

    const categoryCounts = await Product.aggregate([
      { $match: { dateOfSale: { $regex: regex } } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    res.status(200).json(categoryCounts);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getCombinedData = async (req, res) => {
  try {
    const [statistics, barChart, pieChart] = await Promise.all([
      getStatistics(req, res),
      getBarChartData(req, res),
      getPieChartData(req, res),
    ]);

    res.status(200).json({ statistics, barChart, pieChart });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  initializeDatabase,
  listTransactions,
  getStatistics,
  getBarChartData,
  getPieChartData,
  getCombinedData,
};