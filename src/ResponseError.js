class ResponseError extends Error {
  constructor(res, body) {
    super(`${res.status} error requesting ${res.url}: ${body.message}`);
    this.status = res.status;
    this.path = res.url;
    this.body = body;
  }
}

module.exports = ResponseError;
