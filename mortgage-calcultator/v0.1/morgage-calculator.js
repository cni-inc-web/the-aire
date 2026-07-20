document.addEventListener('DOMContentLoaded', function() {
    // Calculate once on load
    calcMonthlyPayment();

    // Add event listeners to input fields
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('input', calcMonthlyPayment);
    });

    // Add event listeners to radio buttons
    const radioButtons = document.querySelectorAll('input[type="radio"]');
    radioButtons.forEach(radioButton => {
        radioButton.addEventListener('change', updateTextAndCalc);
    });
});

function calcMonthlyPayment() {
    // Retrieve form field values
    let p = parseFloat(document.getElementById('principal').value);
    let t = parseFloat(document.getElementById('term').value);
    let d = parseFloat(document.getElementById('downPayment').value);
    let r = parseFloat(document.getElementById('interestRate').value);

    // Convert blanks to zeros
    if (isNaN(p)) {
        p = 0;
    }
    if (isNaN(t)) {
        t = 0;
    }
    if (isNaN(d)) {
        d = 0;
    }
    if (isNaN(r)) {
        r = 0;
    }

    // Check if p field is blank or zero
    if (p === 0) {
        document.getElementById('result').textContent = "$0.00";
        document.getElementById('result').classList.add('mortgageResult');
        return; // Exit function if p is zero
    }

    // Check if t field is blank or zero
    if (t === 0) {
        document.getElementById('result').textContent = "∞";
        document.getElementById('result').classList.add('mortgageResult');
        return; // Exit function if t is zero
    }

    // Determine the selected principal option
    const principalOption = document.querySelector('input[name="principalOption"]:checked').value;

    // Calculate principal based on the selected option
    let principal;
    if (principalOption === "percentage") {
        principal = p - (p * (d / 100)); // Option 1: Subtract percentage of principal as down payment from the principal
    } else {
        principal = p - d; // Option 2: Subtract down payment directly from the principal
    }

    // If interest rate = 0%, simplify the formula
    let monthlyPayment;

    if (r === 0) {
        monthlyPayment = (p - d) / (t * 12);
    } else {
        const interestRate = r / 100;
        const monthlyInterest = interestRate / 12;
        const topCalc = principal * monthlyInterest;
        const bottomCalc = 1 - Math.pow(1 + monthlyInterest, 12 * t * -1);

        // Check for division by zero
        if (bottomCalc === 0) {
            console.error("Division by zero");
            return; // Exit function if division by zero occurs
        }

        monthlyPayment = topCalc / bottomCalc;
    }

    // Check if result is NaN
    if (isNaN(monthlyPayment)) {
        console.error("Calculation resulted in NaN");
        return; // Exit function if result is NaN
    }

    const roundedPayment = Math.round(monthlyPayment * 100) / 100;

    // Display the result on the page
    const formattedResult = roundedPayment.toLocaleString('en-US', {style: 'currency', currency: 'USD'});
    document.getElementById('result').textContent = formattedResult;
    document.getElementById('result').classList.add('mortgageResult');
}

// Function to update the text and calculate monthly payment
function updateTextAndCalc() {
    // Get the elements
    const downpaymentTypeText = document.getElementById('downpayment-type');
    const percentageRadio = document.getElementById('percentage');
    const dollarRadio = document.getElementById('dollars');
    const downPaymentInput = document.getElementById('downPayment');
    const principalInput = parseFloat(document.getElementById('principal').value);

    if (percentageRadio.checked) {
        downpaymentTypeText.textContent = '%';
        // Calculate down payment based on percentage
        const downPaymentPercentage = parseFloat(downPaymentInput.value);
        let newDownPayment = (downPaymentPercentage / principalInput) * 100;
        if (!Number.isInteger(newDownPayment)) {
            newDownPayment = newDownPayment.toFixed(2);
        }
        downPaymentInput.value = newDownPayment.toString(); // Set the new down payment value
    } else if (dollarRadio.checked) {
        downpaymentTypeText.textContent = '$';
        // Calculate down payment based on dollar amount
        const downPaymentDollar = parseFloat(downPaymentInput.value);
        let newDownPayment = (downPaymentDollar / 100) * principalInput;
        if (!Number.isInteger(newDownPayment)) {
            newDownPayment = newDownPayment.toFixed(2);
        }
        downPaymentInput.value = newDownPayment.toString(); // Set the new down payment value
    }
    // Recalculate monthly payment
    calcMonthlyPayment();
}