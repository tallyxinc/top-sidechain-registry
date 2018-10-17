# SideChainRegistry
## Overview

A side-chain registry is needed in order to keep status information about each marketplace inside the Tallyx system and its marketplace id. The information could be updated automatically by creating a back-end service which will communicate with the smart contract or manually. In order to edit functions of smart contract from being executed by unauthorized party, we have a registry of permissions for each address.

## Internal process

Basically, there are two main functions and they’re ‘addSidechain’ and ‘removeSidechain’, when new marketplace appears inside Tallyx system, addSidechain function will be executed and its status will be active, once some issues appear we call removeSidechain function and our marketplace is marked like inactive.

## Functions

1.  **setPermission( address _address, uint256 _permission)**
Allow/Disallow(depends on _permission value) function call permissions for selected address _address - receiver of permissions
**Return value:** void

2. **sidechainFabricStatus( address _sidechainTokiFabricAddress)**
Returns status of side-chain TokiFabric SC, could be active(true)/inactive(false), inactive in case side-chain was recognized as non-valid 
_sidechainTokiFabricAddress - address of TokiFabric smart contract
**Return value:** bool
**Sample return value:** true

3.  **sidechainMarketplaceId( _sidechainTokiFabricAddress)**
Returns marketplace id of side-chain TokiFabric SC _sidechainTokiFabricAddress - address of TokiFarbic smart contract
**Return value:**  uint256
**Sample return value**: 10

4.  **addSidechain( address _sidechainTokiFabricAddress, uint256 _marketplaceId)**
Adds new side-chain TokiFabric SC address to registry, assigning to it marketplace id.
_sidechainTokiFabricAddress - address of TokiFabric smart contract 
_marketplaceId - unique identifier inside Tallyx system for each side-chain (marketplace)
**Return value:** void

5. **removeSidechain( address _sidechainTokiFabricAddress)**
Removes selected side-chain TokiFabric SC address from registry, clearing all data connected with it .
_sidechainTokiFabricAddress - address of TokiFabric smart contract
**Return value:** void