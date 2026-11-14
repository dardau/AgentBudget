const {subtask}=require('hardhat/config');
const {TASK_COMPILE_SOLIDITY_GET_SOLC_BUILD}=require('hardhat/builtin-tasks/task-names');
subtask(TASK_COMPILE_SOLIDITY_GET_SOLC_BUILD).setAction(async()=>({compilerPath:require.resolve('solc/soljson.js'),isSolcJs:true,version:'0.8.28',longVersion:require('solc').version()}));
module.exports={solidity:{version:'0.8.28',settings:{optimizer:{enabled:true,runs:200}}},networks:{hardhat:{chainId:31337}},mocha:{timeout:40000}};
