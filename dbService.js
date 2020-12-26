module.exports = function(db) {
  function check_database() {
    
  }
  return {
    check() {
      console.log("check");
      console.log(db);
    },
  }
};