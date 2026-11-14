// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
/// @notice Educational local-network spending control. Never use with real funds.
/// @dev Local native test balances represent payment units, not USDC. No x402 integration.
contract AgentBudget is ReentrancyGuard {
    address public immutable owner;
    address public agent;
    uint256 public perPaymentLimit;
    uint256 public budgetLimit;
    uint256 public spent;
    uint256 public deadline;
    bool public paused;
    mapping(address => bool) public allowed;
    mapping(bytes32 => bool) public usedRequest;
    event Funded(uint256 amount);
    event Paid(bytes32 indexed requestId,address indexed provider,uint256 amount);
    event Paused(bool state);
    event AgentChanged(address agent);
    event ProviderChanged(address provider,bool enabled);
    event Withdrawn(uint256 amount);
    error Unauthorized(); error InvalidInput(); error Stopped(); error Expired();
    error ProviderDenied(); error PaymentLimit(); error BudgetLimit(); error Duplicate();
    error InsufficientFunds(); error TransferFailed();
    modifier onlyOwner(){if(msg.sender!=owner) revert Unauthorized();_;}
    constructor(address agent_,uint256 perPayment_,uint256 budget_,uint256 deadline_){
        if(agent_==address(0)||agent_==msg.sender||perPayment_==0||budget_<perPayment_||deadline_<=block.timestamp) revert InvalidInput();
        owner=msg.sender;agent=agent_;perPaymentLimit=perPayment_;budgetLimit=budget_;deadline=deadline_;
    }
    function fund() external payable onlyOwner {if(msg.value==0) revert InvalidInput();emit Funded(msg.value);}
    function setProvider(address provider,bool enabled) external onlyOwner {
        if(provider==address(0)||provider==address(this)) revert InvalidInput();allowed[provider]=enabled;emit ProviderChanged(provider,enabled);
    }
    function setPaused(bool state) external onlyOwner {paused=state;emit Paused(state);}
    function setAgent(address next) external onlyOwner {if(next==address(0)||next==owner) revert InvalidInput();agent=next;emit AgentChanged(next);}
    function pay(bytes32 id,address payable provider,uint256 amount) external nonReentrant {
        if(msg.sender!=agent) revert Unauthorized();
        if(paused) revert Stopped(); if(block.timestamp>=deadline) revert Expired();
        if(!allowed[provider]) revert ProviderDenied();
        if(id==bytes32(0)||amount==0) revert InvalidInput();
        if(usedRequest[id]) revert Duplicate(); if(amount>perPaymentLimit) revert PaymentLimit();
        if(amount>budgetLimit-spent) revert BudgetLimit();
        if(amount>address(this).balance) revert InsufficientFunds();
        usedRequest[id]=true; spent+=amount;
        (bool ok,)=provider.call{value:amount}(""); if(!ok) revert TransferFailed();
        emit Paid(id,provider,amount);
    }
    function withdraw(uint256 amount) external onlyOwner nonReentrant {
        if(amount==0||amount>address(this).balance) revert InvalidInput();
        (bool ok,)=payable(owner).call{value:amount}("");if(!ok) revert TransferFailed();emit Withdrawn(amount);
    }
}
