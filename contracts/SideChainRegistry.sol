pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol"; 
import "./Permissions.sol";

contract SideChainRegistry is Ownable, Permissions {

    // Mapping from address of toki fabric contract to his current status
    // If marketplace(contract) was marked as non-valid, value will be false
    mapping (address => bool) public sidechainTokiFabricStatus;

    // Mapping from address of toki fabric contract to his marketplace id
    mapping (address => uint256) public sidechainMarkeplaceIds;

    // Emits when new toki fabric contract is added to registry
    event SideChainOpened(
        address sidechainTokiFabricAddress, 
        uint256 marketplaceId
    );

    // Emits when new toki fabric contract is removed from registry
    event SideChainClosed(
        address sidechainTokiFabricAddress, 
        uint256 marketplaceId
    );

    /** 
     * @dev Constructor for SideChainRegistry smart contract for Tallyx system 
     */ 
    constructor() 
        public
        Permissions()     
    {
        permissions[msg.sender] = PERMISSION_SET_PERMISSION | PERMISSION_TO_MODIFY; 
    }

    /**
     * @dev Returns status of side-chain TokiFabric SC, could be active(true)/inactive(false),
     * inactive in case side-chain was recognized as non-valid
     * @param _sidechainTokiFabricAddress - Address of TokiFabric smart contract
     */
    function sidechainFabricStatus(address _sidechainTokiFabricAddress)
        public 
        view 
        returns (bool)
    {
        return sidechainTokiFabricStatus[_sidechainTokiFabricAddress];
    }

    /**
     * @dev Returns marketplace id of side-chain TokiFabric SC
     * @param _sidechainTokiFabricAddress - Address of TokiFarbic smart contract
     */
    function sidechainMarketplaceId(address _sidechainTokiFabricAddress)
        public 
        view
        returns (uint256)
    {
        return sidechainMarkeplaceIds[_sidechainTokiFabricAddress];
    }

    /**
     * @dev Adds new side-chain TokiFabric SC address to registry, assigning 
     * to it marketplace id
     * @param _sidechainTokiFabricAddress - Address of TokiFabric smart contract
     * @param _marketplaceId - Unique identifier inside Tallyx system for each 
     * side-chain (marketplace)
     */
    function addSidechain(
        address _sidechainTokiFabricAddress,
        uint256 _marketplaceId
    ) 
        public
        hasPermission(msg.sender, PERMISSION_TO_MODIFY)
    {   
        require(
            _sidechainTokiFabricAddress != address(0) &&
            _marketplaceId > 0
        );

        sidechainTokiFabricStatus[_sidechainTokiFabricAddress] = true;
        sidechainMarkeplaceIds[_sidechainTokiFabricAddress] = _marketplaceId;

        emit SideChainOpened(
            _sidechainTokiFabricAddress,
            _marketplaceId
        );
    }

    /** 
     * @dev Removes selected side-chain TokiFabric SC address from registry, 
     * clearing all data connected with it
     * @param _sidechainTokiFabricAddress - Address of TokiFabric smart contract
     */
    function removeSidechain(address _sidechainTokiFabricAddress)
        public 
        hasPermission(msg.sender, PERMISSION_TO_MODIFY)
    {
        require(
            _sidechainTokiFabricAddress != address(0) &&
            sidechainTokiFabricStatus[_sidechainTokiFabricAddress] == true
        );

        uint256 marketplaceId = sidechainMarkeplaceIds[_sidechainTokiFabricAddress];

        sidechainTokiFabricStatus[_sidechainTokiFabricAddress] = false;
        sidechainMarkeplaceIds[_sidechainTokiFabricAddress] = 0;

        emit SideChainClosed(
            _sidechainTokiFabricAddress,
            marketplaceId
        );
    }
}