exports.customErrors = (error, request, response, next) => {
  if (error.status && error.msg) {
    response.status(error.status).send({ msg: error.msg });
  } else {
    next(error);
  }
};

exports.postgresErrors = (error, request, response, next) => {
  if (error.code === "22P02") {
    response.status(400).send({ msg: "Bad Request" });
  } else {
    next(error);
  }
};

exports.internalErrors = (error, request, response, next) => {
  console.log(error);
  response.status(500).send({ msg: "Internal Server Error" });
};
