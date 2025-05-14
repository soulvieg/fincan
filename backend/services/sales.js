import sequelize from "../config/db";

export default async function handler(req, res) {
  try {
    const [results] = await sequelize.query('CALL total_sales();');
    
    const total = results[0][0]?.total || 0;
    
    res.status(200).json({ success: true, total });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}
