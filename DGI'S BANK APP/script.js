"use strict";

// const { jsx } = require("react/jsx-runtime");

console.log("check in");
// DATA
const account1 = {
  owner: "ntongho-abasi Inemesit Essien",
  movements: [2000, 9000, -2000, 50000, -30000, 90, 1200],
  interestRate: 0.5, //%
  pin: 1111,
};
const account2 = {
  owner: "nsiskak edouk",
  movements: [5000, 30000, -15000, 60000, -30000, 300, 1200],
  interestRate: 0.3, //%
  pin: 2222,
};
const account3 = {
  owner: "chioma chukwuka",
  movements: [-40000, -11000, -9000, -50000, -30000, -90, -1200],
  interestRate: 0.3, //%
  pin: 3333,
};
const account4 = {
  owner: "idongesit sampson",
  movements: [
    1200, 9000, -2000, 50000, -30000, 90, 1200, 53000, 80000, 19000, 3022,
    -19000,
  ],
  interestRate: 0.3, //%
  pin: 4444,
};

const account5 = {
  owner: "nsikak thomas",
  movements: [
    2000, 9000, -2000, 50000, -30000, 90, 1200, 100000, 20000, -90000, 30000,
  ],
  interestRate: 0.3, //%
  pin: 5555,
};

const fullAccounts = [account1, account2, account3, account4, account5];

// SELECTING ELEMENTS
// Container
const containerMovementEl = document.querySelector(".container-movements");
const main = document.querySelector(".main");
const summary = document.querySelector(".summary");

// Label
const labelBalance = document.querySelector(".balance-total");
const labelTotalDeposit = document.querySelector(".summary-total--in");
const labelTotalWithdrawal = document.querySelector(".summary-total--out");
const labelTotalInterest = document.querySelector(".summary-total--interest");
const labelWelcome = document.querySelector(".label-welcome");

// Buttons
const btnLogin = document.querySelector(".btn__login");
const btnTransfer = document.querySelector(".btn-transfer");
const btnLoan = document.querySelector(".btn-loan");
const btnCloseAcc = document.querySelector(".btn-close");
const btnLogout = document.querySelector(".btn-logout");

// Inputs
const inputLoginUsername = document.querySelector(".login-input-username");
const inputLoginPin = document.querySelector(".login-input-pin");
const inputTransferUsername = document.querySelector(".input_transfer-user");
const inputTransferAmount = document.querySelector(".input_transfer-amount");
const inputLoanAmount = document.querySelector(".input_loan-amount");
const inputCloseusername = document.querySelector(".input_close-user");
const inputClosePin = document.querySelector(".input_close-pin");

// Dropdown elements
const dropdownBtn = document.getElementById("dropdownBtn");
const dropdownMenu = document.getElementById("dropdownMenu");
const dropdownContent = document.querySelector(".dropdown-content");

// localStorage.clear();

const overall = function (accounts = fullAccounts) {
  console.log(accounts);

  // ===========================
  // DROPDOWN FUNCTIONALITY
  // ===========================
  const populateDropdown = function (accs) {
    dropdownContent.innerHTML = "";
    
    accs.forEach((acc) => {
      const accountItem = document.createElement("div");
      accountItem.className = "account-item";
      accountItem.innerHTML = `
        <div class="account-name">${acc.owner}</div>
        <div class="account-credentials">
          <div class="credential-item">
            <span class="credential-label">USER:</span>
            <span class="credential-value">${acc.username}</span>
            <span class="copy-indicator" data-type="username" data-value="${acc.username}">✓ Copied</span>
          </div>
          <div class="credential-item">
            <span class="credential-label">PIN:</span>
            <span class="credential-value">${acc.pin}</span>
            <span class="copy-indicator" data-type="pin" data-value="${acc.pin}">✓ Copied</span>
          </div>
        </div>
      `;
      
      // Click to auto-fill and copy to clipboard
      accountItem.addEventListener("click", function () {
        inputLoginUsername.value = acc.username;
        inputLoginPin.value = acc.pin;
        
        // Close dropdown
        dropdownBtn.classList.remove("active");
        dropdownMenu.classList.remove("active");
        
        // Focus on the form for immediate login
        inputLoginUsername.focus();
      });

      // Copy to clipboard on credential click
      const credentialValues = accountItem.querySelectorAll(".credential-value");
      credentialValues.forEach((credValue) => {
        credValue.addEventListener("click", function (e) {
          e.stopPropagation();
          const text = this.textContent;
          navigator.clipboard.writeText(text).then(() => {
            const indicator = this.parentElement.querySelector(".copy-indicator");
            indicator.classList.add("show");
            setTimeout(() => {
              indicator.classList.remove("show");
            }, 2000);
          });
        });
      });

      dropdownContent.appendChild(accountItem);
    });
  };

  // Toggle dropdown menu
  dropdownBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    dropdownBtn.classList.toggle("active");
    dropdownMenu.classList.toggle("active");
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", function (e) {
    if (!e.target.closest(".accounts-dropdown")) {
      dropdownBtn.classList.remove("active");
      dropdownMenu.classList.remove("active");
    }
  });

  // Close dropdown when pressing Escape
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      dropdownBtn.classList.remove("active");
      dropdownMenu.classList.remove("active");
    }
  });

  // THE APP STARTS HERE
  const displayMovement = function (mov) {
    containerMovementEl.innerHTML = "";

    mov.forEach((mov, i) => {
      const type = mov > 1 ? "deposit" : "withdrawal";

      const html = `
     <div class="movements-row">
            <div class="movements-type movement-type--${type}">${
        i + 1
      } ${type}</div>
            <div class="movements-value">${mov.toLocaleString()}</div>
    </div>
    `;
      containerMovementEl.insertAdjacentHTML("afterbegin", html);
      
    });
  };

  const calcDisplayBalance = function (acc) {
    acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
    labelBalance.textContent = `₦${acc.balance.toLocaleString()}`;
  };

  const calcDisplaySummary = function (mov) {
    // 1. Total Amount Deposited
    const totalDeposit = mov
      .filter((mov) => mov > 0)
      .reduce((acc, mov) => acc + mov, 0);
    labelTotalDeposit.textContent = `₦${totalDeposit.toLocaleString()}`;

    // 2. Total Amount Withdrawn
    const totalWithdrawal = mov
      .filter((mov) => mov < 0)
      .reduce((acc, mov) => acc + mov, 0);
    labelTotalWithdrawal.textContent = `₦${Math.abs(
      totalWithdrawal
    ).toLocaleString()}`;

    // 3. Total Interest
    const totalInterest = mov
      .filter((mov) => mov > 0)
      .map((mov) => (mov * account4.interestRate) / 100)
      .reduce((acc, int) => acc + int, 0);
    labelTotalInterest.textContent = `₦${totalInterest.toLocaleString()}`;

    console.log(totalInterest);
  };

  // UPDATING THE UI
  const updateUI = function (acc) {
    displayMovement(currentAccount.movements);

    // Display balance
    calcDisplayBalance(currentAccount);

    // Display the summary
    calcDisplaySummary(currentAccount.movements);
  };

  // CLEARING THE INPUTS
  const clearInputs = function () {
    inputLoginPin.value = inputLoginUsername.value = "";
    inputLoginPin.blur();

    inputTransferUsername.value = inputTransferAmount.value = "";
    inputTransferAmount.blur();

    inputLoanAmount.value = "";
    inputLoanAmount.blur();

    inputClosePin.value = inputCloseusername.pin = "";
    inputClosePin.blur();
  };

  // IMPLEMENTING LOGIN FUNCTIONALITY

 

  const createUsername = function (accs) {
    accs.forEach(
      (acc) =>
        (acc.username = acc.owner
          .toLowerCase()
          .split(" ")
          .map((firstLetter) => firstLetter[0])
          .join(""))
    );
  };

  createUsername(accounts);

  // Populate the dropdown with all accounts
  populateDropdown(accounts);

  let currentAccount;

  btnLogin.addEventListener("click", function (e) {
    e.preventDefault();

    currentAccount = accounts.find(
      (acc) =>
        inputLoginUsername.value === acc.username &&
        Number(inputLoginPin.value) === acc.pin
    );


    
    if (currentAccount) {
      labelWelcome.textContent = `Welcome back, ${
        currentAccount.owner.split(" ")[0]
      }`;
      console.log(currentAccount);
      console.log(currentAccount.owner.split(" ")[0]);
      // Display the welcome message and UI

      main.classList.remove("no-visible");
      summary.classList.remove("no-visible");

      // Display the movements
      updateUI(currentAccount);
    }

    // Clear inputs
    clearInputs();
  });

  // IMPLEMENTING THE TRANSFER FUNCTIONALITY
  btnTransfer.addEventListener("click", function (e) {
    e.preventDefault();

    const recipientAccount = accounts.find(
      (acc) => inputTransferUsername.value === acc.username
    );
    const amount = Number(inputTransferAmount.value);

    if (
      recipientAccount &&
      amount > 0 &&
      currentAccount.balance >= amount &&
      recipientAccount !== currentAccount
    ) {
      currentAccount.movements.push(-amount);
      recipientAccount.movements.push(amount);

      // Update the UI
      updateUI(currentAccount);

      console.log("Transfered");
    }

    clearInputs();
  });

  // IMPLEMENTING REQUESTING LOAN
  btnLoan.addEventListener("click", function (e) {
    e.preventDefault();
    const amount = Number(inputLoanAmount.value);

    if (
      amount > 0 &&
      currentAccount.movements.some((mov) => mov > 0 && amount < mov) &&
      currentAccount.balance > 0
    ) {
      currentAccount.movements.push(amount);

      // Update the UI
      updateUI(currentAccount);
    }

    clearInputs();
  });

  // IMPLEMENTING THE CLOSING OF ACCOUNT FUNCTIONALITY
  btnCloseAcc.addEventListener("click", function (e) {
    e.preventDefault();

    if (
      currentAccount.username === inputCloseusername.value &&
      currentAccount.pin === Number(inputClosePin.value)
    ) {
      const index = accounts.findIndex(
        (acc) => currentAccount.username === acc.username
      );

      accounts.splice(index, 1);
      console.log(accounts);

      localStorage.setItem("accounts", JSON.stringify(accounts));

      // Resetting the welcome message
      labelWelcome.textContent = `Log in to get started`;
      labelWelcome;

      main.classList.add("no-visible");
      summary.classList.add("no-visible");
    }

    clearInputs();
  });

  // THE LOGOUT FUNCTIONALITY
  btnLogout.addEventListener("click", function () {
    // Resetting the welcome message
    labelWelcome.textContent = `Log in to get started`;

    // Hidding the UI
    main.classList.add("no-visible");
    summary.classList.add("no-visible");

    // Clearing all the input
    clearInputs();
  });
};

const newAccounts = JSON.parse(localStorage.getItem("accounts"))
  ? JSON.parse(localStorage.getItem("accounts"))
  : undefined;
console.log(newAccounts);
overall(newAccounts);

// // localStorage.clear();

// const netisensStu = {
//   firstStu: "Chizzy",
//   secondStu: "Lewis",
//   thirdStu: "Khadija",
//   fourthStu: "Odudu",
//   fifthStu: "Joshua",
// };

// // Setting items into local storage
// localStorage.setItem("Lewis", JSON.stringify(netisensStu));
// localStorage.setItem("President", "Tinubu");

// // Getting items from the local storage.
// const localStoData = JSON.parse(localStorage.getItem("Lewis"));

// console.log(localStoData);
// localStorage.removeItem("President");

// Default Parameter

// const grettingMachine = function (greet = "Student") {
//   console.log(`Hello ${greet}`);
// };

// grettingMachine("People");

// Problem Solving Skill

// 1.Define the problem
// The account is lost at reload, so the closed account can still login

// 2. Solution
// We should be store the account somewhere (localStorage) so we can retrieve after deletion

// 3. How to the Solution