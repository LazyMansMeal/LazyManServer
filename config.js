const development = {
  database: {
    name: "test",
    host: "localhost",
    port: 28015
  }
}

const staging = {
  database: {
    name: "sawyer",
    host: "localhost",
    port: 28015
  }
}

const production = {
  database: {
    name: "iris",
    host: "localhost",
    port: 28015
  }
}

const config = {
  development,
  staging,
  production
}


module.exports = config[process.env.LAZYMAN_ENV]