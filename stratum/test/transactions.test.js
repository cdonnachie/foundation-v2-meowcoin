const Transactions = require('../main/transactions');
const config = require('../../configs/example');
const testdata = require('../../daemon/test/daemon.mock');

config.primary.address = 'EQrdpxFbEYgBUk2tfsQcUyHUcGHCN35PMH';
config.primary.recipients = [];

const auxiliaryConfig = {
  'enabled': false,
  'coin': {
    'header': 'fabe6d6d',
  }
};

const auxiliaryData = {
  'chainid': 1,
  'hash': '17a35a38e70cd01488e0d5ece6ded04a9bc8125865471d36b9d5c47a08a5907c',
};

const extraNonce = Buffer.from('f000000ff111111f', 'hex');

const coinbasetxn = {
  'minerdevfund': {
    'addresses': [
      'eHNUGzw8ZG9PGC8gKtnneyMaQXQTtAUm98',
      'e7Tkk3kjS9NjSYVX2Q8qzxXB1WKMRvea1j'
    ],
    'minimumvalue': 27780000000
  }
};

const coinbasetesttxn = {
  'minerdevfund': {
    'addresses': [
      'n2rxh4SrVLkzASyxaP3jB6Zf2TEfsPXdMz',
      'muFMkxZeEpptRMNK1zWvsi2aPRNULCin3s'
    ],
    'minimumvalue': 27780000000
  }
};


////////////////////////////////////////////////////////////////////////////////

describe('Test transactions functionality', () => {

  let configCopy, rpcDataCopy;
  beforeEach(() => {
    configCopy = JSON.parse(JSON.stringify(config));
    rpcDataCopy = JSON.parse(JSON.stringify(testdata.getBlockTemplate()));
  });

  test('Test main transaction builder [1]', () => {
    const transaction = new Transactions(configCopy, rpcDataCopy).handleGeneration(extraNonce);
    expect(transaction[0].slice(0, -5)).toStrictEqual(Buffer.from('01000000010000000000000000000000000000000000000000000000000000000000000000ffffffff1203f82f0104', 'hex'));
    expect(transaction[1]).toStrictEqual(Buffer.from('000000000300715a363a0000001976a914547cdb89297908f714743ae7ab06b329c6aa30d188ac0029d1770600000017a914a78f72cdb3a7ee5f09d5259ae7eb64231858bdc2870000000000000000266a24aa21a9ede2f61c3f71d1defd3fa999dfa36953755c690689799962b48bebd836974e8cf900000000', 'hex'));
  });

  test('Test main transaction builder [2]', () => {
    rpcDataCopy.coinbasetxn = coinbasetxn;
    rpcDataCopy.coinbasetxn.data = '0500008085202';
    const transaction = new Transactions(configCopy, rpcDataCopy).handleGeneration(extraNonce);
    expect(transaction[0].slice(0, -5)).toStrictEqual(Buffer.from('05000080010000000000000000000000000000000000000000000000000000000000000000ffffffff1203f82f0104', 'hex'));
    expect(transaction[1]).toStrictEqual(Buffer.from('000000000300715a363a0000001976a914547cdb89297908f714743ae7ab06b329c6aa30d188ac0029d1770600000017a914a78f72cdb3a7ee5f09d5259ae7eb64231858bdc2870000000000000000266a24aa21a9ede2f61c3f71d1defd3fa999dfa36953755c690689799962b48bebd836974e8cf900000000', 'hex'));
  });

  test('Test main transaction builder [3]', () => {
    rpcDataCopy.coinbasetxn = coinbasetxn;
    configCopy.primary.recipients.push({ address: 'EQrdpxFbEYgBUk2tfsQcUyHUcGHCN35PMH', percentage: 0.05 });
    const transaction = new Transactions(configCopy, rpcDataCopy).handleGeneration(extraNonce);
    expect(transaction[0].slice(0, -5)).toStrictEqual(Buffer.from('05000080010000000000000000000000000000000000000000000000000000000000000000ffffffff1203f82f0104', 'hex'));
    expect(transaction[1]).toStrictEqual(Buffer.from('0000000004c0513c4d370000001976a914547cdb89297908f714743ae7ab06b329c6aa30d188ac0029d1770600000017a914a78f72cdb3a7ee5f09d5259ae7eb64231858bdc287401f1ee9020000001976a914547cdb89297908f714743ae7ab06b329c6aa30d188ac0000000000000000266a24aa21a9ede2f61c3f71d1defd3fa999dfa36953755c690689799962b48bebd836974e8cf900000000', 'hex'));
  });

  test('Test main transaction builder [4]', () => {
    rpcDataCopy.coinbasetxn = coinbasetxn;
    configCopy.primary.recipients.push({ address: 'EQrdpxFbEYgBUk2tfsQcUyHUcGHCN35PMH', percentage: 0.05 });
    configCopy.primary.recipients.push({ address: 'EQrdpxFbEYgBUk2tfsQcUyHUcGHCN35PMH', percentage: 0.05 });
    const transaction = new Transactions(configCopy, rpcDataCopy).handleGeneration(extraNonce);
    expect(transaction[0].slice(0, -5)).toStrictEqual(Buffer.from('05000080010000000000000000000000000000000000000000000000000000000000000000ffffffff1203f82f0104', 'hex'));
    expect(transaction[1]).toStrictEqual(Buffer.from('000000000580321e64340000001976a914547cdb89297908f714743ae7ab06b329c6aa30d188ac0029d1770600000017a914a78f72cdb3a7ee5f09d5259ae7eb64231858bdc287401f1ee9020000001976a914547cdb89297908f714743ae7ab06b329c6aa30d188ac401f1ee9020000001976a914547cdb89297908f714743ae7ab06b329c6aa30d188ac0000000000000000266a24aa21a9ede2f61c3f71d1defd3fa999dfa36953755c690689799962b48bebd836974e8cf900000000', 'hex'));
  });

  test('Test main transaction builder [5]', () => {
    rpcDataCopy.coinbasetxn = coinbasetxn;
    rpcDataCopy.coinbaseaux.flags = 'test';
    const transaction = new Transactions(configCopy, rpcDataCopy).handleGeneration(extraNonce);
    expect(transaction[0].slice(0, -5)).toStrictEqual(Buffer.from('05000080010000000000000000000000000000000000000000000000000000000000000000ffffffff1203f82f0104', 'hex'));
    expect(transaction[1]).toStrictEqual(Buffer.from('000000000300715a363a0000001976a914547cdb89297908f714743ae7ab06b329c6aa30d188ac0029d1770600000017a914a78f72cdb3a7ee5f09d5259ae7eb64231858bdc2870000000000000000266a24aa21a9ede2f61c3f71d1defd3fa999dfa36953755c690689799962b48bebd836974e8cf900000000', 'hex'));
  });

  test('Test main transaction builder [6]', () => {
    rpcDataCopy.coinbasetxn = coinbasetxn;
    delete rpcDataCopy.default_witness_commitment;
    const transaction = new Transactions(configCopy, rpcDataCopy).handleGeneration(extraNonce);
    expect(transaction[0].slice(0, -5)).toStrictEqual(Buffer.from('05000080010000000000000000000000000000000000000000000000000000000000000000ffffffff1203f82f0104', 'hex'));
    expect(transaction[1]).toStrictEqual(Buffer.from('000000000200715a363a0000001976a914547cdb89297908f714743ae7ab06b329c6aa30d188ac0029d1770600000017a914a78f72cdb3a7ee5f09d5259ae7eb64231858bdc28700000000', 'hex'));
  });

  test('Test main transaction builder [7]', () => {
    rpcDataCopy.coinbasetxn = coinbasetxn;
    rpcDataCopy.auxData = auxiliaryData;
    configCopy.auxiliary = auxiliaryConfig;
    configCopy.auxiliary.enabled = true;
    const transaction = new Transactions(configCopy, rpcDataCopy).handleGeneration(extraNonce);
    expect(transaction[0].slice(0, 47)).toStrictEqual(Buffer.from('05000080010000000000000000000000000000000000000000000000000000000000000000ffffffff3e03f82f0104', 'hex'));
    expect(transaction[0].slice(52, 56)).toStrictEqual(Buffer.from('fabe6d6d', 'hex'));
    expect(transaction[0].slice(56)).toStrictEqual(Buffer.from('17a35a38e70cd01488e0d5ece6ded04a9bc8125865471d36b9d5c47a08a5907c0100000000000000', 'hex'));
    expect(transaction[1]).toStrictEqual(Buffer.from('000000000300715a363a0000001976a914547cdb89297908f714743ae7ab06b329c6aa30d188ac0029d1770600000017a914a78f72cdb3a7ee5f09d5259ae7eb64231858bdc2870000000000000000266a24aa21a9ede2f61c3f71d1defd3fa999dfa36953755c690689799962b48bebd836974e8cf900000000', 'hex'));
  });

  test('Test main transaction builder [8]', () => {
    rpcDataCopy.coinbasetxn = coinbasetesttxn;
    configCopy.settings.testnet = true;
    configCopy.primary.address = 'mxQ4kX7k8c84JgNb6p8kbmxZD889YytnDT';
    const transaction = new Transactions(configCopy, rpcDataCopy).handleGeneration(extraNonce);
    expect(transaction[0].slice(0, -5)).toStrictEqual(Buffer.from('01000000010000000000000000000000000000000000000000000000000000000000000000ffffffff1203f82f0104', 'hex'));
    expect(transaction[1]).toStrictEqual(Buffer.from('000000000300715a363a0000001976a914b92c9db55f187b0d7f11e7c2d82e1cdc74301ce388ac0029d177060000001976a914ea234ab400ccbb0ae2ec1870a75671104b5bfc0688ac0000000000000000266a24aa21a9ede2f61c3f71d1defd3fa999dfa36953755c690689799962b48bebd836974e8cf900000000', 'hex'));
  });
});
