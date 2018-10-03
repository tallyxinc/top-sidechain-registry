pragma solidity ^0.4.24;

import 'openzeppelin-solidity/contracts/ownership/Ownable.sol'; 

contract SideChainRegistry is Ownable {

    mapping (address => bool) public changeAgent;

    mapping (address => bool) public sidechainTokiFabricStatus;

    mapping (address => uint256) public sidechainMarkeplaceIds;

    modifier onlyChangeAgent() {
        require(changeAgent[msg.sender] == true);
        _;
    }

    event SideChainOpened(address sidechainTokiFabricAddress, uint256 marketplaceId);

    event SideChainClosed(address sidechainTokiFabricAddress, uint256 marketplaceId);

    constructor() public {
        changeAgent[msg.sender] = true;
    }

    function updateChangeAgent(
        address _agent,
        bool _status
    )
        public
        onlyOwner
    {
        require(_agent != address(0));
        changeAgent[_agent] = _status;
    }

    function getSidechainFabricStatus(address _sidechainTokiFabricAddress)
        public 
        view 
        returns (bool)
    {
        return sidechainTokiFabricStatus[_sidechainTokiFabricAddress];
    }

    function getSidechainMarketplaceId(address _sidechainTokiFabricAddress)
        public 
        view
        returns (uint256)
    {
        return sidechainMarkeplaceIds[_sidechainTokiFabricAddress];
    }

    function addSidechain(
        address _sidechainTokiFabricAddress,
        uint256 _marketplaceId
    ) 
        public
        onlyChangeAgent
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

    function removeSidechain(
        address _sidechainTokiFabricAddress
    )
        public 
        onlyChangeAgent
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