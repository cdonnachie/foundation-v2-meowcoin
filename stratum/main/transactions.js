const utils = require('./utils');

////////////////////////////////////////////////////////////////////////////////

// Main Transactions Function
const Transactions = function(config, rpcData) {

  const _this = this;
  this.config = config;
  this.rpcData = rpcData;

  // Mainnet Configuration
  this.configMainnet = {
    bech32: '',
    bip32: {
      public: Buffer.from('0488B21E', 'hex').readUInt32LE(0),
      private: Buffer.from('0488ADE4', 'hex').readUInt32LE(0),
    },
    peerMagic: '4d455743',
    pubKeyHash: Buffer.from('32', 'hex').readUInt8(0),
    scriptHash: Buffer.from('7A', 'hex').readUInt8(0),
    wif: Buffer.from('70', 'hex').readUInt8(0),
    coin: 'mewc',
  };

  // Testnet Configuration
  this.configTestnet = {
    bech32: '',
    bip32: {
      public: Buffer.from('043587CF', 'hex').readUInt32LE(0),
      private: Buffer.from('04358394', 'hex').readUInt32LE(0),
    },
    peerMagic: '6d657763',
    pubKeyHash: Buffer.from('6D', 'hex').readUInt8(0),
    scriptHash: Buffer.from('7C', 'hex').readUInt8(0),
    wif: Buffer.from('72', 'hex').readUInt8(0),
    coin: 'tmewc',
  };

  // Calculate Generation Transaction
  this.handleGeneration = function(placeholder) {

    const txLockTime = 0;
    const txInSequence = 0;
    const txInPrevOutHash = '';
    const txInPrevOutIndex = Math.pow(2, 32) - 1;
    const txOutputBuffers = [];

    let txVersion = 1;
    const network = !_this.config.settings.testnet ?
      _this.configMainnet :
      _this.configTestnet;

    // Use Version Found in CoinbaseTxn
    if (_this.rpcData.coinbasetxn && _this.rpcData.coinbasetxn.data) {
      txVersion = parseInt(utils.reverseHex(_this.rpcData.coinbasetxn.data.slice(0, 8)), 16);
    }

    // Calculate Coin Block Reward
    let reward = _this.rpcData.coinbasevalue;

    // Handle Pool/Coinbase Addr/Flags
    const poolAddressScript = utils.addressToScript(_this.config.primary.address, network);
    const coinbaseAux = _this.rpcData.coinbaseaux && _this.rpcData.coinbaseaux.flags ?
      Buffer.from(_this.rpcData.coinbaseaux.flags, 'hex') :
      Buffer.from([]);

    // Build Initial ScriptSig
    let scriptSig = Buffer.concat([
      utils.serializeNumber(_this.rpcData.height),
      coinbaseAux,
      utils.serializeNumber(Date.now() / 1000 | 0),
      Buffer.from([placeholder.length]),
    ]);

    // Add Auxiliary Data to ScriptSig
    if (_this.config.auxiliary && _this.config.auxiliary.enabled && _this.rpcData.auxData) {
      scriptSig = Buffer.concat([
        scriptSig,
        Buffer.from(_this.config.auxiliary.coin.header, 'hex'),
        Buffer.from(_this.rpcData.auxData.hash, 'hex'),
        utils.packUInt32LE(1),
        utils.packUInt32LE(0)
      ]);
    }

    // Build First Part of Generation Transaction
    const p1 = Buffer.concat([
      utils.packUInt32LE(txVersion),
      utils.varIntBuffer(1),
      utils.uint256BufferFromHash(txInPrevOutHash),
      utils.packUInt32LE(txInPrevOutIndex),
      utils.varIntBuffer(scriptSig.length + placeholder.length),
      scriptSig,
    ]);

    // Handle Founder Transactions
    const address = _this.rpcData.CommunityAutonomousAddress;
    const communityReward = _this.rpcData.CommunityAutonomousValue;
    const communityScript = utils.addressToScript(address, network);
    reward -= communityReward;
    txOutputBuffers.push(Buffer.concat([
      utils.packUInt64LE(communityReward),
      utils.varIntBuffer(communityScript.length),
      communityScript,
    ]));
    
    // Handle Recipient Transactions
    let recipientTotal = 0;
    _this.config.primary.recipients.forEach((recipient) => {
      const recipientReward = Math.floor(recipient.percentage * reward);
      const recipientScript = utils.addressToScript(recipient.address, network);
      recipientTotal += recipientReward;
      txOutputBuffers.push(Buffer.concat([
        utils.packUInt64LE(recipientReward),
        utils.varIntBuffer(recipientScript.length),
        recipientScript,
      ]));
    });

    // Handle Pool Transaction
    reward -= recipientTotal;
    txOutputBuffers.unshift(Buffer.concat([
      utils.packUInt64LE(reward),
      utils.varIntBuffer(poolAddressScript.length),
      poolAddressScript
    ]));

    // Handle Witness Commitment
    if (_this.rpcData.default_witness_commitment !== undefined) {
      const witness_commitment = Buffer.from(_this.rpcData.default_witness_commitment, 'hex');
      txOutputBuffers.push(Buffer.concat([
        utils.packUInt64LE(0),
        utils.varIntBuffer(witness_commitment.length),
        witness_commitment
      ]));
    }

    // Build Second Part of Generation Transaction
    const p2 = Buffer.concat([
      utils.packUInt32LE(txInSequence),
      utils.varIntBuffer(txOutputBuffers.length),
      Buffer.concat(txOutputBuffers),
      utils.packUInt32LE(txLockTime),
    ]);

    return [p1, p2];
  };
};

module.exports = Transactions;
