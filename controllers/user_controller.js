const getUserDashboard = (req, res) => {
  res.send("User dashboard");
};

// updating user
const update_profile = (req, res) => {
  const identity_verification = req.params.id;
  res.send("Update Your Profile ");
  console.log(identity_verification);
};

// // Aministrator Dashboard
const administratorDashboard = (req, res) => {
  res.send("Admins dashboard");
};

module.exports = {
  getUserDashboard,
  update_profile,
  administratorDashboard,
};
