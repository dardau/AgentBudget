// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;
interface IBudget {function pay(bytes32,address payable,uint256) external;}
/// @notice Adversarial test fixture only.
contract TestReceiver {
 IBudget public target;bool public reject;bool public attack;bool public blocked;
 function configure(address t,bool r,bool a) external {target=IBudget(t);reject=r;attack=a;}
 function trigger(bytes32 id,uint256 amount) external {target.pay(id,payable(address(this)),amount);}
 receive() external payable {
  require(!reject,"reject");
  if(attack){try target.pay(keccak256("nested"),payable(address(this)),1){blocked=false;}catch{blocked=true;}}
 }
}
