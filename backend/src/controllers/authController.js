// دالة تجريبية فقط لتأكيد نجاح الفحص
const register = async (req, res) => {
  res.status(201).json({
    status: 'success',
    message: 'you made it to controller',
    data: req.body
  });
};

module.exports = {
  register
};