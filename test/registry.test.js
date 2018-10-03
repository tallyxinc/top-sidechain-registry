const SideChainRegistry = artifacts.require('SideChainRegistry');
const SimpleToken = artifacts.require('test/SimpleToken');
const { decodeLogs } = require('./decodeLogs');
const abi = require('ethereumjs-abi');
const BigNumber = require('bignumber.js');
const Utils = require('./utils');

let precision = new BigNumber('1000000000000000000');

contract('SideChainRegistry', accounts => {
 
	let owner = accounts[0];
	let sideChainRegistry;

	beforeEach(async () => {
		sideChainRegistry = await SideChainRegistry.new({from: owner});
	});	

	describe('Check basic flow', () => {
		it('should check that owner is change agent', async () => {
			let changeAgentStatus = await sideChainRegistry.changeAgent.call(owner);
			assert.equal(changeAgentStatus, true, "owner is not change agent");
		});

		it('should not update change agent cause msg.sender != owner', async () => {
			let newChangeAgent = accounts[1];
			let msgSender = accounts[2];

			let newChangeAgentStatus = await sideChainRegistry.changeAgent.call(newChangeAgent);
			assert.equal(newChangeAgentStatus, false, "user is change agent");

			await sideChainRegistry.updateChangeAgent(newChangeAgent, true, {from: msgSender})
				.then(Utils.receiptShouldFailed)
				.catch(Utils.catchReceiptShouldFailed);

			newChangeAgentStatus = await sideChainRegistry.changeAgent.call(newChangeAgent);
			assert.equal(newChangeAgentStatus, false, 'user is change agent');
		});

		it('should not update change agent cause agent == address(0)', async () => {
			let newChangeAgent = 0x0;

			let newChangeAgentStatus = await sideChainRegistry.changeAgent.call(newChangeAgent);
			assert.equal(newChangeAgentStatus, false, "user is change agent");

			await sideChainRegistry.updateChangeAgent(newChangeAgent, true, {from: owner})
				.then(Utils.receiptShouldFailed)
				.catch(Utils.catchReceiptShouldFailed);

			newChangeAgentStatus = await sideChainRegistry.changeAgent.call(newChangeAgent);
			assert.equal(newChangeAgentStatus, false, "user is change agent");
		});

		it('should update change agent', async () => {
			let newChangeAgent = accounts[1];

			let newChangeAgentStatus = await sideChainRegistry.changeAgent.call(newChangeAgent);
			assert.equal(newChangeAgentStatus, false, "user is chnage agent");

			await sideChainRegistry.updateChangeAgent(newChangeAgent, true, {from: owner})
				.then(Utils.receiptShouldSucceed);

			newChangeAgentStatus = await sideChainRegistry.changeAgent.call(newChangeAgent);
			assert.equal(newChangeAgentStatus, true, "user is not change agent");
		});

		it('should not add side chain cause msg.sender != change agent', async () => {
			let sideChainName = "Apple";
			let sideChainSymbol = "APL";
			let marketplaceId = 1;
			let sideChainOwner = accounts[2];
			let sideChain = await SimpleToken.new({from: sideChainOwner});
			let sideChainAddress = sideChain.address;

			let newChangeAgentStatus = await sideChainRegistry.changeAgent.call(sideChainOwner);
			assert.equal(newChangeAgentStatus, false, "user is change agent");

			let sidechainTokiFabricStatus = await sideChainRegistry.sidechainTokiFabricStatus.call(sideChainAddress);
			assert.equal(sidechainTokiFabricStatus, false, "sidechainTokiFabricStatus is not equal");

			let sideChainMarketplaceIds = await sideChainRegistry.sidechainMarkeplaceIds.call(sideChainAddress);
			assert.equal(sideChainMarketplaceIds.valueOf(), new BigNumber('0').valueOf(), "sideChain marketplaceId is not equal");

			await sideChainRegistry.addSidechain(sideChainAddress, marketplaceId, {from: sideChainOwner})
				.then(Utils.receiptShouldFailed)
				.catch(Utils.catchReceiptShouldFailed);

			sidechainTokiFabricStatus = await sideChainRegistry.sidechainTokiFabricStatus.call(sideChainAddress);
			assert.equal(sidechainTokiFabricStatus, false, "sidechainTokiFabricStatus is not equal");

			sideChainMarketplaceIds = await sideChainRegistry.sidechainMarkeplaceIds.call(sideChainAddress);
			assert.equal(sideChainMarketplaceIds.valueOf(), new BigNumber('0').valueOf(), "sideChain marketplaceId is not equal");
		});

		it('should not add side chain cause sidechain == address(0)', async () => {
			let marketplaceId = 1;
			let sideChainAddress = 0x0;

			let sidechainTokiFabricStatus = await sideChainRegistry.sidechainTokiFabricStatus.call(sideChainAddress);
			assert.equal(sidechainTokiFabricStatus, false, "sidechainTokiFabricStatus is not equal");

			let sideChainMarketplaceIds = await sideChainRegistry.sidechainMarkeplaceIds.call(sideChainAddress);
			assert.equal(sideChainMarketplaceIds.valueOf(), new BigNumber('0').valueOf(), "sideChain marketplaceId is not equal");

			await sideChainRegistry.addSidechain(sideChainAddress, marketplaceId, {from: owner})
				.then(Utils.receiptShouldFailed)
				.catch(Utils.catchReceiptShouldFailed);

			sidechainTokiFabricStatus = await sideChainRegistry.sidechainTokiFabricStatus.call(sideChainAddress);
			assert.equal(sidechainTokiFabricStatus, false, "sidechainTokiFabricStatus is not equal");

			sideChainMarketplaceIds = await sideChainRegistry.sidechainMarkeplaceIds.call(sideChainAddress);
			assert.equal(sideChainMarketplaceIds.valueOf(), new BigNumber('0').valueOf(), "sideChain marketplaceId is not equal");
		});

		it('should not add side chain cause marketplaceId == 0', async () => {
			let sideChainName = "Apple";
			let sideChainSymbol = "APL";
			let marketplaceId = 0;
			let sideChainOwner = accounts[2];
			let sideChain = await SimpleToken.new({from: sideChainOwner});
			let sideChainAddress = sideChain.address;

			let newChangeAgentStatus = await sideChainRegistry.changeAgent.call(sideChainOwner);
			assert.equal(newChangeAgentStatus, false, "user is change agent");

			let sidechainTokiFabricStatus = await sideChainRegistry.sidechainTokiFabricStatus.call(sideChainAddress);
			assert.equal(sidechainTokiFabricStatus, false, "sidechainTokiFabricStatus is not equal");

			let sideChainMarketplaceIds = await sideChainRegistry.sidechainMarkeplaceIds.call(sideChainAddress);
			assert.equal(sideChainMarketplaceIds.valueOf(), new BigNumber('0').valueOf(), "sideChain marketplaceId is not equal");

			await sideChainRegistry.addSidechain(sideChainAddress, marketplaceId, {from: owner})
				.then(Utils.receiptShouldFailed)
				.catch(Utils.catchReceiptShouldFailed);

			sidechainTokiFabricStatus = await sideChainRegistry.sidechainTokiFabricStatus.call(sideChainAddress);
			assert.equal(sidechainTokiFabricStatus, false, "sidechainTokiFabricStatus is not equal");

			sideChainMarketplaceIds = await sideChainRegistry.sidechainMarkeplaceIds.call(sideChainAddress);
			assert.equal(sideChainMarketplaceIds.valueOf(), new BigNumber('0').valueOf(), "sideChain marketplaceId is not equal");
		});	

		it('should add side chain', async () => {
			let sideChainName = "Apple";
			let sideChainSymbol = "APL";
			let marketplaceId = 1;
			let sideChainOwner = accounts[2];
			let sideChain = await SimpleToken.new({from: sideChainOwner});
			let sideChainAddress = sideChain.address;

			let newChangeAgentStatus = await sideChainRegistry.changeAgent.call(sideChainOwner);
			assert.equal(newChangeAgentStatus, false, "user is change agent");

			let sidechainTokiFabricStatus = await sideChainRegistry.sidechainTokiFabricStatus.call(sideChainAddress);
			assert.equal(sidechainTokiFabricStatus, false, "sidechainTokiFabricStatus is not equal");

			let sideChainMarketplaceIds = await sideChainRegistry.sidechainMarkeplaceIds.call(sideChainAddress);
			assert.equal(sideChainMarketplaceIds.valueOf(), new BigNumber('0').valueOf(), "sideChain marketplaceId is not equal");

			await sideChainRegistry.addSidechain(sideChainAddress, marketplaceId, {from: owner})
				.then(Utils.receiptShouldSucceed);

			sidechainTokiFabricStatus = await sideChainRegistry.sidechainTokiFabricStatus.call(sideChainAddress);
			assert.equal(sidechainTokiFabricStatus, true, "sidechainTokiFabricStatus is not equal");

			sideChainMarketplaceIds = await sideChainRegistry.sidechainMarkeplaceIds.call(sideChainAddress);
			assert.equal(sideChainMarketplaceIds.valueOf(), new BigNumber('1').valueOf(), "sideChain marketplaceId is not equal");


			let sideChainOpenedEvents = sideChainRegistry.SideChainOpened({}, {fromBlock: 0, toBlock: 'latest'});

			sideChainOpenedEvents.get((err, logs) => {
				assert.equal(logs.length, 1, "were emitted less or more than 1 event");
                assert.equal(logs[0].event, "SideChainOpened", "event type is not equal");
                assert.equal(logs[0].args.sidechainTokiFabricAddress, sideChainAddress, "sideChainAddress is not equal");
                assert.equal(new BigNumber(logs[0].args.marketplaceId).valueOf(), marketplaceId, "marketplaceId is not equal");

                console.log('SideChainOpened event: \n');
                logs.forEach(log => console.log(log.args));
			});
		});

		it('should get sidechain marketplaceId', async () => {
			let sideChainName = "Apple";
			let sideChainSymbol = "APL";
			let marketplaceId = 1;
			let sideChainOwner = accounts[2];
			let sideChain = await SimpleToken.new({from: sideChainOwner});
			let sideChainAddress = sideChain.address;

			let newChangeAgentStatus = await sideChainRegistry.changeAgent.call(sideChainOwner);
			assert.equal(newChangeAgentStatus, false, "user is change agent");

			let sidechainTokiFabricStatus = await sideChainRegistry.sidechainTokiFabricStatus.call(sideChainAddress);
			assert.equal(sidechainTokiFabricStatus, false, "sidechainTokiFabricStatus is not equal");

			let sideChainMarketplaceIds = await sideChainRegistry.sidechainMarkeplaceIds.call(sideChainAddress);
			assert.equal(sideChainMarketplaceIds.valueOf(), new BigNumber('0').valueOf(), "sideChain marketplaceId is not equal");

			await sideChainRegistry.addSidechain(sideChainAddress, marketplaceId, {from: owner})
				.then(Utils.receiptShouldSucceed);

			sidechainTokiFabricStatus = await sideChainRegistry.sidechainTokiFabricStatus.call(sideChainAddress);
			assert.equal(sidechainTokiFabricStatus, true, "sidechainTokiFabricStatus is not equal");

			sideChainMarketplaceIds = await sideChainRegistry.sidechainMarkeplaceIds.call(sideChainAddress);
			assert.equal(sideChainMarketplaceIds.valueOf(), new BigNumber('1').valueOf(), "sideChain marketplaceId is not equal");

			let sidechainMarketPlaceId = await sideChainRegistry.getSidechainMarketplaceId(sideChainAddress);
			assert.equal(sidechainMarketPlaceId.valueOf(), marketplaceId, "marketplaceId is not equal");

			sidechainMarketPlaceId = await sideChainRegistry.getSidechainMarketplaceId(accounts[4]);
			assert.equal(sidechainMarketPlaceId.valueOf(), 0, "marketplaceId is not equal");
		});

		it('should get sidechain status', async () => {
			let sideChainName = "Apple";
			let sideChainSymbol = "APL";
			let marketplaceId = 1;
			let sideChainOwner = accounts[2];
			let sideChain = await SimpleToken.new({from: sideChainOwner});
			let sideChainAddress = sideChain.address;

			let newChangeAgentStatus = await sideChainRegistry.changeAgent.call(sideChainOwner);
			assert.equal(newChangeAgentStatus, false, "user is change agent");

			let sidechainTokiFabricStatus = await sideChainRegistry.sidechainTokiFabricStatus.call(sideChainAddress);
			assert.equal(sidechainTokiFabricStatus, false, "sidechainTokiFabricStatus is not equal");

			let sideChainMarketplaceIds = await sideChainRegistry.sidechainMarkeplaceIds.call(sideChainAddress);
			assert.equal(sideChainMarketplaceIds.valueOf(), new BigNumber('0').valueOf(), "sideChain marketplaceId is not equal");

			await sideChainRegistry.addSidechain(sideChainAddress, marketplaceId, {from: owner})
				.then(Utils.receiptShouldSucceed);

			sidechainTokiFabricStatus = await sideChainRegistry.sidechainTokiFabricStatus.call(sideChainAddress);
			assert.equal(sidechainTokiFabricStatus, true, "sidechainTokiFabricStatus is not equal");

			sideChainMarketplaceIds = await sideChainRegistry.sidechainMarkeplaceIds.call(sideChainAddress);
			assert.equal(sideChainMarketplaceIds.valueOf(), new BigNumber('1').valueOf(), "sideChain marketplaceId is not equal");

			sidechainTokiFabricStatus = await sideChainRegistry.getSidechainFabricStatus(sideChainAddress);
			assert.equal(sidechainTokiFabricStatus, true, "status is not equal");

			sidechainTokiFabricStatus = await sideChainRegistry.getSidechainFabricStatus(accounts[4]);
			assert.equal(sidechainTokiFabricStatus, false, "status is not equal");
		});

		it('should not remove sidechain cause msg.sender != change agent', async () => {
			let sideChainName = "Apple";
			let sideChainSymbol = "APL";
			let marketplaceId = 1;
			let sideChainOwner = accounts[2];
			let sideChain = await SimpleToken.new({from: sideChainOwner});
			let sideChainAddress = sideChain.address;

			let newChangeAgentStatus = await sideChainRegistry.changeAgent.call(sideChainOwner);
			assert.equal(newChangeAgentStatus, false, "user is change agent");

			let sidechainTokiFabricStatus = await sideChainRegistry.sidechainTokiFabricStatus.call(sideChainAddress);
			assert.equal(sidechainTokiFabricStatus, false, "sidechainTokiFabricStatus is not equal");

			let sideChainMarketplaceIds = await sideChainRegistry.sidechainMarkeplaceIds.call(sideChainAddress);
			assert.equal(sideChainMarketplaceIds.valueOf(), new BigNumber('0').valueOf(), "sideChain marketplaceId is not equal");

			await sideChainRegistry.addSidechain(sideChainAddress, marketplaceId, {from: owner})
				.then(Utils.receiptShouldSucceed);

			sidechainTokiFabricStatus = await sideChainRegistry.sidechainTokiFabricStatus.call(sideChainAddress);
			assert.equal(sidechainTokiFabricStatus, true, "sidechainTokiFabricStatus is not equal");

			sideChainMarketplaceIds = await sideChainRegistry.sidechainMarkeplaceIds.call(sideChainAddress);
			assert.equal(sideChainMarketplaceIds.valueOf(), new BigNumber('1').valueOf(), "sideChain marketplaceId is not equal");

			await sideChainRegistry.removeSidechain(sideChainAddress, {from: sideChainOwner})
				.then(Utils.receiptShouldFailed)
				.catch(Utils.catchReceiptShouldFailed);

			sidechainTokiFabricStatus = await sideChainRegistry.sidechainTokiFabricStatus.call(sideChainAddress);
			assert.equal(sidechainTokiFabricStatus, true, "sidechainTokiFabricStatus is not equal");

			sideChainMarketplaceIds = await sideChainRegistry.sidechainMarkeplaceIds.call(sideChainAddress);
			assert.equal(sideChainMarketplaceIds.valueOf(), new BigNumber('1').valueOf(), "sideChain marketplaceId is not equal");
		});

		it('should remove sidechain', async () => {
			let sideChainName = "Apple";
			let sideChainSymbol = "APL";
			let marketplaceId = 1;
			let sideChainOwner = accounts[2];
			let sideChain = await SimpleToken.new({from: sideChainOwner});
			let sideChainAddress = sideChain.address;

			let newChangeAgentStatus = await sideChainRegistry.changeAgent.call(sideChainOwner);
			assert.equal(newChangeAgentStatus, false, "user is change agent");

			let sidechainTokiFabricStatus = await sideChainRegistry.sidechainTokiFabricStatus.call(sideChainAddress);
			assert.equal(sidechainTokiFabricStatus, false, "sidechainTokiFabricStatus is not equal");

			let sideChainMarketplaceIds = await sideChainRegistry.sidechainMarkeplaceIds.call(sideChainAddress);
			assert.equal(sideChainMarketplaceIds.valueOf(), new BigNumber('0').valueOf(), "sideChain marketplaceId is not equal");

			await sideChainRegistry.addSidechain(sideChainAddress, marketplaceId, {from: owner})
				.then(Utils.receiptShouldSucceed);

			sidechainTokiFabricStatus = await sideChainRegistry.sidechainTokiFabricStatus.call(sideChainAddress);
			assert.equal(sidechainTokiFabricStatus, true, "sidechainTokiFabricStatus is not equal");

			sideChainMarketplaceIds = await sideChainRegistry.sidechainMarkeplaceIds.call(sideChainAddress);
			assert.equal(sideChainMarketplaceIds.valueOf(), new BigNumber('1').valueOf(), "sideChain marketplaceId is not equal");

			await sideChainRegistry.removeSidechain(sideChainAddress, {from: owner})
				.then(Utils.receiptShouldSucceed);

			sidechainTokiFabricStatus = await sideChainRegistry.sidechainTokiFabricStatus.call(sideChainAddress);
			assert.equal(sidechainTokiFabricStatus, false, "sidechainTokiFabricStatus is not equal");

			sideChainMarketplaceIds = await sideChainRegistry.sidechainMarkeplaceIds.call(sideChainAddress);
			assert.equal(sideChainMarketplaceIds.valueOf(), new BigNumber('0').valueOf(), "sideChain marketplaceId is not equal");

			let sideChainClosedEvents = await sideChainRegistry.SideChainClosed({}, {fromBlock: 0, toBlock: 'latest'});

			sideChainClosedEvents.get((err, logs) => {
				assert.equal(logs.length, 1, "were emitted less or more than 1 event");
                assert.equal(logs[0].event, "SideChainClosed", "event type is not equal");
                assert.equal(logs[0].args.sidechainTokiFabricAddress, sideChainAddress, "sideChainAddress is not equal");
                assert.equal(new BigNumber(logs[0].args.marketplaceId).valueOf(), marketplaceId, "marketplaceId is not equal");

                console.log('SideChainClosed event: \n');
                logs.forEach(log => console.log(log.args));
			});
		});

		it('should not remove sidechain cause side chain address == address(0)', async () => {
			sideChainAddress = 0x0;

			await sideChainRegistry.removeSidechain(sideChainAddress, {from: owner})
				.then(Utils.receiptShouldFailed)
				.catch(Utils.catchReceiptShouldFailed);

			sidechainTokiFabricStatus = await sideChainRegistry.sidechainTokiFabricStatus.call(sideChainAddress);
			assert.equal(sidechainTokiFabricStatus, false, "sidechainTokiFabricStatus is not equal");

			sideChainMarketplaceIds = await sideChainRegistry.sidechainMarkeplaceIds.call(sideChainAddress);
			assert.equal(sideChainMarketplaceIds.valueOf(), new BigNumber('0').valueOf(), "sideChain marketplaceId is not equal");
		});
	});
});