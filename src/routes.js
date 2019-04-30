import { Router } from 'express';

const routes = Router();

const TRANSACTION_URI = '/transactions';
const TRANSACTION_URI_ID = TRANSACTION_URI + "/:id";

routes.get('/', async (req, res) => {
  let balance = await Promise.resolve(getBalance(transactionHistory_State));
  let balanceResponse = {
    balance: balance
  };
  res.json(balanceResponse);
});

routes.get(TRANSACTION_URI, async (req,res) => {
  let response = await Promise.resolve(transactionHistory_State);
  res.json(response);
});

routes.post(TRANSACTION_URI, async (req,res) => {
  console.info("req.body", req.body);

  let parsedAmount = parseFloat(req.body.amount);
  let type = req.body.type;

  console.info("parsedAmount", parsedAmount);

  if(!req.body ||
    parsedAmount < 0 ||
    !isTypeValid(type)){
    res.status(400).send(await Promise.resolve('ERROR: Invalid Transaction.'));
  }

  let newTransaction = new Transaction(
    getNewId(),
    type,
    parsedAmount,
    getCurrentDate()
  );

  var newState = await insert(newTransaction);

  if(!newState) {
    res.status(400).send(await Promise.resolve('ERROR: Invalid Transaction.'));
    return;
  }

  console.info("newState", newState);

  transactionHistory_State = newState;

  res.json(await Promise.resolve(newTransaction));
});

routes.get(TRANSACTION_URI_ID, async (req, res) => {
  console.info("req.params", req.params);

  let id = req.params.id;

  var result = find([...transactionHistory_State], id);

  console.info("result", result);

  if(!result){
    res.status(400).send('ERROR: Not Found.');
    return;
  }

  res.json(await Promise.resolve(result));
});

const operations = {
  CREDIT: 'credit',
  DEBIT: 'debit'
};

class Transaction {
  id;
  type;
  amount;
  effectiveDate;

  constructor(id, type, amount, effectiveDate) {
    this.id = id;
    this.type = type;
    this.amount = amount;
    this.effectiveDate = effectiveDate;
  }
}

let getNewId = () => Math.floor(Math.random() * (100000));

let getCurrentDate = () => new Date().toISOString();

let isTypeValid = (type) => type === operations.DEBIT || type === operations.CREDIT;

let transactionHistory_State = [
  new Transaction(getNewId(), operations.CREDIT, 100, getCurrentDate())
];

//TODO: Implement async/await
//TODO: Microlock --> https://github.com/thebigredgeek/microlock
let insert = async (t) => {
  console.log("insert");

  let newTransactionHistoryState = [...transactionHistory_State, t];

  let valid = validateState(newTransactionHistoryState);

  if(!valid){
    return false;
  }

  return await Promise.resolve(newTransactionHistoryState);
};

let validateState = (transactionHistoryToValidate) => {
  console.log("validateState");
  console.info("transactionHistoryToValidate", transactionHistoryToValidate);

  let balance = getBalance(transactionHistoryToValidate);

  console.info("balance", balance);

  return balance >= 0;
}

let getBalance = (transactions) => {
  console.log("getBalance");

  let balance = transactions.reduce((previous, current) => {
    console.info("current",current);

    if(current.type === operations.CREDIT){
      return previous + current.amount;
    }

    if(current.type === operations.DEBIT){
      return previous - current.amount;
    }

  }, 0);

  return balance;
};

//TODO: Implement async/await
//TODO: Microlock --> https://github.com/thebigredgeek/microlock
let find = (state, id) =>
  state.find((x) =>
    x.id == id
  );

export default routes;
