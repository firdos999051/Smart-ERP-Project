let customers = [];
let products = [];
let cart = [];
let lastInvoice = null;

// Add Customer
function addCustomer() {
    let name = document.getElementById("custName").value;
    if (!name) return alert("Enter customer name");

    customers.push(name);

    let select = document.getElementById("customerList");
    let option = new Option(name, name);
    select.add(option);

    document.getElementById("custName").value = "";
}

// Add Product
function addProduct() {
    let name = document.getElementById("prodName").value;
    let price = document.getElementById("prodPrice").value;

    if (!name || !price) return alert("Enter product & price");

    products.push({ name, price: Number(price) });

    let select = document.getElementById("productList");
    let option = new Option(name, name);
    select.add(option);

    document.getElementById("prodName").value = "";
    document.getElementById("prodPrice").value = "";
}

// Add Item to cart
function addItem() {
    let productName = document.getElementById("productList").value;
    let qty = Number(document.getElementById("qty").value);

    if (!productName || !qty) return alert("Select product & quantity");

    let product = products.find(p => p.name === productName);

    cart.push({
        product: productName,
        qty: qty,
        price: product.price,
        total: product.price * qty
    });

    let li = document.createElement("li");
    li.innerText = `${productName} - ${qty} x ₹${product.price}`;
    document.getElementById("items").appendChild(li);

    document.getElementById("qty").value = "";
}

// Create Invoice
function createInvoice() {
    let customer = document.getElementById("customerList").value;
    if (!customer) return alert("Select customer");

    let total = 0;

    cart.forEach(item => {
        total += item.total;
    });

    lastInvoice = {
        customer,
        items: cart,
        total
    };

    alert("Invoice Saved ✅");
}

// 🔥 PROFESSIONAL GST PDF
function downloadPDF() {
    if (!lastInvoice) {
        alert("Create invoice first!");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Company Header
    doc.setFontSize(16);
    doc.text("SMART ERP ENTERPRISE", 55, 10);

    doc.setFontSize(10);
    doc.text("GST INVOICE", 90, 16);

    // Box
    doc.rect(10, 20, 190, 30);

    // Customer Details
    doc.text("Customer: " + lastInvoice.customer, 12, 30);
    doc.text("Date: " + new Date().toLocaleDateString(), 140, 30);
    doc.text("Invoice No: INV" + Math.floor(Math.random()*1000), 12, 38);

    // Table Data
    let tableData = lastInvoice.items.map((item, i) => [
        i + 1,
        item.product,
        item.qty,
        "₹" + item.price,
        "₹" + item.total
    ]);

    // Table
    doc.autoTable({
        startY: 55,
        head: [["#", "Product", "Qty", "Price", "Total"]],
        body: tableData
    });

    let finalY = doc.lastAutoTable.finalY + 10;

    // GST Calculation
    let subtotal = lastInvoice.total;
    let cgst = subtotal * 0.09;
    let sgst = subtotal * 0.09;
    let grandTotal = subtotal + cgst + sgst;

    // Summary Box
    doc.rect(120, finalY - 5, 80, 35);

    doc.text("Subtotal: ₹" + subtotal.toFixed(2), 125, finalY);
    doc.text("CGST (9%): ₹" + cgst.toFixed(2), 125, finalY + 8);
    doc.text("SGST (9%): ₹" + sgst.toFixed(2), 125, finalY + 16);

    doc.setFontSize(12);
    doc.text("Grand Total: ₹" + grandTotal.toFixed(2), 125, finalY + 26);

    // Footer
    doc.setFontSize(10);
    doc.text("Thank you for your business!", 70, finalY + 45);

    doc.save("GST_Invoice.pdf");
}