// Declaring these as a global because we need to access them in other functions too.
var outMonthlyPayment;
var outTotalPaid;
var outInterestPaid;


function calculatePersonalLoan() {
    //Radio buttons
    var pRadioBtn = document.getElementById("personalRadioBtn");
    var aRadioBtn = document.getElementById("autoRadioBtn");
    var mRadioBtn = document.getElementById("mortgageRadioBtn");
    // Get Values
    var downPayment = document.getElementById('downPayments').value;
    if(aRadioBtn.checked == true) {
      document.getElementById('loanAmount').value = $("#carValue").val() - $("#tradeValue").val();
    } else if(mRadioBtn.checked == true) {
      document.getElementById('loanAmount').value = $("#homeValue").val();
    }


    var totalAmount = document.getElementById('loanAmount').value - downPayment;
    var annualIntRate = document.getElementById('loanRate').value;
    var periodicInterestRate = (annualIntRate / 100) / 12;
    var numberOfPeriodicPayments =  document.getElementById('loanTermMonths').value;
    var discountFactor;
    discountFactor = ((1+periodicInterestRate) ** numberOfPeriodicPayments - 1) / (periodicInterestRate * (1 + periodicInterestRate) ** numberOfPeriodicPayments);
    var loanPayment = totalAmount / discountFactor;

    // Output Values
    outMonthlyPayment = loanPayment.toFixed(2);
    outTotalPaid = (loanPayment * numberOfPeriodicPayments).toFixed(2);
    outInterestPaid = ((loanPayment * numberOfPeriodicPayments) - totalAmount).toFixed(2);


   //if this is mortgage loan add monthly insurance to monthly payment.
    if(mRadioBtn.checked == true){
      outMonthlyPayment = parseFloat(outMonthlyPayment);
      var homeIns = parseFloat($("#homeInsurance").val());
      outMonthlyPayment += homeIns;
    }

    // Validate inputs
    document.getElementById("inErrMsg").innerHTML = "";
    document.getElementById("inErrMsg").style.display = "none";
    var validInput = validateInputs(totalAmount,annualIntRate,numberOfPeriodicPayments);

    // Clear output fields in case of recalculation
    document.getElementById('monthlyPayments').innerHTML = "<p>Monthly Payment:<br>$0.00</p>";
    document.getElementById('totalPaid').innerHTML = "<p>Total Amount Paid:<br>$0.00</p>";
    document.getElementById('interestPaid').innerHTML = "<p>Total Interest Paid:<br>$0.00</p>";
    document.getElementById('amortListDiv').innerHTML = "";

    // Display Values
    if(validInput){
        document.getElementById('monthlyPayments').innerHTML = "<p>Monthly Payment:<br>$" + outMonthlyPayment + "</p>";
        document.getElementById('totalPaid').innerHTML = "<p>Total Amount Paid:<br>$" + outTotalPaid + "</p>";
        document.getElementById('interestPaid').innerHTML = "<p>Total Interest Paid:<br>$" +  outInterestPaid + "</p>";


        // List ammortization
        document.getElementById("amortListDiv").innerHTML =
            amortList(totalAmount,periodicInterestRate,numberOfPeriodicPayments);

        // Create results for exportation
        document.getElementById("outputResults").innerHTML =
            "<p><b>Monthly Payment: </b>$" + outMonthlyPayment + "<br>" +
            "<b>Total Amount Paid: </b>$" + outTotalPaid + "<br>" +
            "<b>Total Interest Paid: </b>$" + outInterestPaid + "<br></p>";
    }
}

function validateInputs(totAmount,intRate,term){
    var div = document.getElementById("inErrMsg");
    var bool = false;
    if(totAmount <= 0 || isNaN(totAmount) || totAmount == null || totAmount == "") {
        div.innerHTML +=
            "<h3>Invalid Loan Amount</h3>" +
            "<p>Please enter a valid number that is greater than 0.</p>";
        div.style.display = "block";
        bool = true;
    }
    if(term <= 0 || isNaN(term) || term == null || term == "") {
        div.innerHTML +=
            "<h3>Invalid Loan Term</h3>" +
            "<p>Please enter a valid number that is greater than 0.</p>";
        div.style.display = "block";
        bool = true;
    }
    if(intRate <= 0 || intRate >= 100 || isNaN(intRate) || intRate == null || intRate == "") {
        div.innerHTML +=
            "<h4>Invalid Loan Interest Rate</h3>" +
            "<p>Please enter a valid number that is between 0 and 100.</p>";
        div.style.display = "block";
        bool = true;
    }
    if (bool == true){
        return false;
    } else {
        return true;
    }
}

function intRateSliderChange(sliderVal) {
  document.getElementById('loanRate').value = sliderVal;
  calculatePersonalLoan();
}

function showAmortList() {
    var div = document.getElementById("amortListDiv");
    if (div.style.display === "none") {
        document.getElementById("showAmortBtn").value = "Hide Amortization";
        div.style.display = "block";
    } else {
        document.getElementById("showAmortBtn").value = "View Amortization";
        div.style.display = "none";
    }
}

// Shows the correct loan calculator based on selected loan type
function showLoanCalc(){
  var personalDiv = document.getElementById("personalLoanDiv");
  var autoDiv = document.getElementById("autoLoanDiv");
  var mortgageDiv = document.getElementById("mortgageLoanDiv");
  var pRadioBtn = document.getElementById("personalRadioBtn");
  var aRadioBtn = document.getElementById("autoRadioBtn");
  var mRadioBtn = document.getElementById("mortgageRadioBtn");

  if(pRadioBtn.checked == true){
    personalDiv.style.display = "block";
    autoDiv.style.display = "none";
    mortgageDiv.style.display = "none";
  }
  else if(aRadioBtn.checked == true){
    personalDiv.style.display = "none";
    autoDiv.style.display = "block";
    mortgageDiv.style.display = "none";
  }
  else if(mRadioBtn.checked == true){
    personalDiv.style.display = "none";
    autoDiv.style.display = "none";
    mortgageDiv.style.display = "block";
  }
}

function amortList(bal, pIntRt, term) {
    var annualInterestRate = pIntRt * 12;

    // calculate the payment
    var payment = bal * (pIntRt/(1-Math.pow(1+pIntRt, -term)));

    // create the header for the ammortized list
    var aList = "<table class='table amortList' id='amortListID'> <thead class='thead-dark'> <tr class='amort'><th class='amort'>Month #</th><th class='amort'>Remaining Balance</th>" +
        "<th class='amort'>Interest</th><th class='amort'>Principal</th> </thead>";

    // calculate ammortized list
    for(var count = 0; count < term; ++count) {
        var interest = 0;
        var principal = 0;

        // new row
        aList += "<tr class='amort'>";

        // month #
        aList += "<td class='amort'>" + (count + 1) + "</td>";

        // remaining balance
        aList += "<td class='amort'> $" + Number(bal).toFixed(2) + "</td>";

        // interest
        interest = bal * pIntRt;
    aList += "<td class='amort'> $" + Number(interest).toFixed(2) + "</td>";

        // principle
        principal = payment - interest;
    aList += "<td class='amort'> $" + Number(principal).toFixed(2) + "</td>";

        // end row
        aList += "</tr>";

        // update balance
        bal = bal - principal;
    }
    // end table
    aList += "</table>";

    return aList;
}

function returnInputsAndOutputs(monthP,totalP,interestP) {
  var pRadioBtn = document.getElementById("personalRadioBtn");
  var aRadioBtn = document.getElementById("autoRadioBtn");
  var mRadioBtn = document.getElementById("mortgageRadioBtn");

  var interest =  document.getElementById('loanTermMonths').value;
  var amount = document.getElementById('loanAmount').value;
  var term = document.getElementById('loanRate').value;
  var downPay = document.getElementById('downPayments').value;
  var autoTradeInVal = document.getElementById('tradeValue').value;
  var homeInsurance = document.getElementById('homeInsurance').value;

  if(pRadioBtn.checked == true){
    return "Loan Amount: $" + amount + "\n" +
           "Down Payments: $" + downPay + "\n" +
           "Loan Term in Months: " + interest + "\n" +
           "Loan Interest Rate: " + term + "%" + "\n" + "\n" +
           "Monthly Payment: $" + monthP + "\n" +
           "Total Amount Paid: $" + totalP + "\n" +
           "Total Interest Paid: $" + interestP + "\n";
  }
  else if(aRadioBtn.checked == true){
    return "Car Value: $" + amount + "\n" +
           "Car Trade-in Value: $" + autoTradeInVal + "\n" +
           "Down Payments: $" + downPay + "\n" +
           "Loan Term in Months: " + interest + "\n" +
           "Loan Interest Rate: " + term + "%" + "\n" + "\n" +
           "Monthly Payment: $" + monthP + "\n" +
           "Total Amount Paid: $" + totalP + "\n" +
           "Total Interest Paid: $" + interestP + "\n";
  }
  else if(mRadioBtn.checked == true){
    return "Home Value: $" + amount + "\n" +
           "Monthly Insurance: $" + homeInsurance + "\n" +
           "Down Payments: $" + downPay + "\n" +
           "Loan Term in Months: " + interest + "\n" +
           "Loan Interest Rate: " + term + "%" + "\n" + "\n" +
           "Monthly Payment: $" + monthP + "\n" +
           "Total Amount Paid: $" + totalP + "\n" +
           "Total Interest Paid: $" + interestP + "\n";
  }
    
}

//function for generating pdf
function generatePDF() {
    //this is from jspdf library
    var doc = new jspdf.jsPDF()

    doc.text(returnInputsAndOutputs(outMonthlyPayment, outTotalPaid, outInterestPaid), 10, 10)
    //gets our amortlist table
    doc.autoTable({margin: { top: 65 }, html: '#amortListID' })
    //saves as filename.pdf
    var string = doc.output('datauristring');
    doc.save('amortizedloan.pdf')
}

function sendEmail() {
  //this is from jspdf library
  var doc = new jspdf.jsPDF()

  doc.text(returnInputsAndOutputs(outMonthlyPayment, outTotalPaid, outInterestPaid), 10, 10)
  //gets our amortlist table
  doc.autoTable({margin: { top: 65 }, html: '#amortListID' })
  //saves as filename.pdf
  var string = doc.output('datauristring');
  console.log(string);
  document.getElementById('pdfString').value = string;
}

//funtion for generating excel
function generateExcel(){
    $(document).ready(function() {
        $("#amortListID").table2excel({
            filename: "Amortized Loan Info.xls"
        });
    });
}

function printList() {
    var sTable = document.getElementById('amortListDiv').innerHTML;
    var results = document.getElementById('outputResults').innerHTML;

    var pRadioBtn = document.getElementById("personalRadioBtn");
    var aRadioBtn = document.getElementById("autoRadioBtn");
    var mRadioBtn = document.getElementById("mortgageRadioBtn");

    var term =  "Loan terms in Months: " + document.getElementById('loanTermMonths').value;
    var pAmount = "Loan Amount: $" +  document.getElementById('loanAmount').value;
    var aAmount = "Car Value: $" +  document.getElementById('loanAmount').value;
    var mAmount = "Home Value: $" +  document.getElementById('loanAmount').value;
    var interest = "Loan interest Rate: " +  document.getElementById('loanRate').value + "%";
    var downPay = "Down Payments: $" + document.getElementById('downPayments').value;
    var autoTradeInVal = "Car Trade-in value: $" + document.getElementById('tradeValue').value;
    var homeInsurance = "Monthly Insurance: $" + document.getElementById('homeInsurance').value;

    var style = "<style>";
    style = style + "table {width: 100%;font: 17px Calibri;}";
    style = style + "table, th, td {border: solid 1px #DDD; border-collapse: collapse;";
    style = style + "padding: 2px 3px;text-align: center;}";
    style = style + "</style>";

    // CREATE A WINDOW OBJECT.
    var win = window.open('', '', 'height=700,width=700');

    if(pRadioBtn.checked == true){
        win.document.write('<html><head>');
        win.document.write('<title>Amortized List</title>');   // <title> FOR PDF HEADER.
        win.document.write(style);          // ADD STYLE INSIDE THE HEAD TAG.
        win.document.write('</head>');
        win.document.write('<body>');
        win.document.write("<b>");
        win.document.write(pAmount);
        win.document.write("<br>");
        win.document.write(downPay);
        win.document.write("<br>");
        win.document.write(term);
        win.document.write("<br>");
        win.document.write(interest);
        win.document.write("</b>");
        win.document.write(results);
        win.document.write(sTable);         // THE TABLE CONTENTS INSIDE THE BODY TAG.
        win.document.write('</body></html>');
      }
      else if(aRadioBtn.checked == true){
        win.document.write('<html><head>');
        win.document.write('<title>Amortized List</title>');   // <title> FOR PDF HEADER.
        win.document.write(style);          // ADD STYLE INSIDE THE HEAD TAG.
        win.document.write('</head>');
        win.document.write('<body>');
        win.document.write("<b>");
        win.document.write(aAmount);
        win.document.write("<br>");
        win.document.write(autoTradeInVal);
        win.document.write("<br>");
        win.document.write(downPay);
        win.document.write("<br>");
        win.document.write(term);
        win.document.write("<br>");
        win.document.write(interest);
        win.document.write("</b>");
        win.document.write(results);
        win.document.write(sTable);         // THE TABLE CONTENTS INSIDE THE BODY TAG.
        win.document.write('</body></html>');
      }
      else if(mRadioBtn.checked == true){
        win.document.write('<html><head>');
        win.document.write('<title>Amortized List</title>');   // <title> FOR PDF HEADER.
        win.document.write(style);          // ADD STYLE INSIDE THE HEAD TAG.
        win.document.write('</head>');
        win.document.write('<body>');
        win.document.write("<b>");
        win.document.write(mAmount);
        win.document.write("<br>");
        win.document.write(homeInsurance);
        win.document.write("<br>");
        win.document.write(downPay);
        win.document.write("<br>");
        win.document.write(term);
        win.document.write("<br>");
        win.document.write(interest);
        win.document.write("</b>");
        win.document.write(results);
        win.document.write(sTable);         // THE TABLE CONTENTS INSIDE THE BODY TAG.
        win.document.write('</body></html>');
      }

    win.document.close(); 	// CLOSE THE CURRENT WINDOW.

    win.print();    // PRINT THE CONTENTS.
}


function showEmailForm() {
    var div = document.getElementById("emailForm");
    if (div.style.display === "none") {
        document.getElementById("emailForm").value = "Hide Amortization";
        div.style.display = "block";
    } else {
        document.getElementById("emailForm").value = "View Amortization";
        div.style.display = "none";
    }
}