'use strict';

const AWS = require('aws-sdk');
const uuid = require('uuid');
const dynamo = new AWS.DynamoDB.DocumentClient();

const headers = {
  'Content-Type': 'application/json',
};

module.exports.getPatients = async (event, context, callback) => {
  let body;
  let statusCode = 200;

  try {
    const patients = await dynamo
      .scan({ TableName: 'http-crud-patients' })
      .promise();
    body = JSON.stringify(patients['Items']);
  } catch (error) {
    statusCode = 500;
    body = JSON.stringify(error);
  }

  const response = {
    statusCode: statusCode,
    headers: headers,
    body: body,
  };

  callback(null, response);
};

module.exports.createPatient = async (event, context, callback) => {
  let requestJSON = JSON.parse(event.body);
  let body;
  let statusCode = 201;

  try {
    const generatedUUID = uuid.v4();
    await dynamo
      .put({
        TableName: 'http-crud-patients',
        Item: {
          id: generatedUUID,
          name: requestJSON.name,
          birthDate: requestJSON.birthDate,
          email: requestJSON.email,
          address: {
            street: requestJSON.address.street,
            district: requestJSON.address.district,
            city: requestJSON.address.city,
            state: requestJSON.address.state,
            zipCode: requestJSON.address.zipCode,
          },
        },
      })
      .promise();

    body = JSON.stringify({ id: generatedUUID });
  } catch (error) {
    statusCode = 500;
    body = JSON.stringify(error);
  }

  const response = {
    statusCode: statusCode,
    headers: headers,
    body: body,
  };

  callback(null, response);
};

module.exports.updatePatient = async (event, context, callback) => {
  let requestJSON = JSON.parse(event.body);
  let body;
  let statusCode = 200;

  try {
    await dynamo
      .put({
        TableName: 'http-crud-patients',
        Item: {
          id: requestJSON.id,
          name: requestJSON.name,
          birthDate: requestJSON.birthDate,
          email: requestJSON.email,
          address: {
            street: requestJSON.address.street,
            district: requestJSON.address.district,
            city: requestJSON.address.city,
            state: requestJSON.address.state,
            zipCode: requestJSON.address.zipCode,
          },
        },
      })
      .promise();

    body = JSON.stringify({ id: requestJSON.id });
  } catch (error) {
    statusCode = 500;
    body = JSON.stringify(error);
  }

  const response = {
    statusCode: statusCode,
    headers: headers,
    body: body,
  };

  callback(null, response);
};

module.exports.removePatient = async (event, context, callback) => {
  let body;
  let statusCode = 200;

  try {
    await dynamo
      .delete({
        TableName: 'http-crud-patients',
        Key: {
          id: event.pathParameters.id,
        },
        ConditionExpression: 'attribute_exists(id)',
        ReturnValues: 'ALL_OLD',
      })
      .promise();
    body = JSON.stringify({ id: 'tchau' });
  } catch (error) {
    statusCode = error.statusCode;
    body = JSON.stringify(error);
  }

  const response = {
    statusCode: statusCode,
    headers: headers,
    body: body,
  };

  callback(null, response);
};
