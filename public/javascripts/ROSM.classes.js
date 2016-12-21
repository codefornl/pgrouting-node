ROSM.extend = function(target_class, properties) {
  for (var property in properties) {
    target_class.prototype[property] = properties[property];
  }
};
