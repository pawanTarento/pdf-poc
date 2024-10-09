const express = require('express');
const path = require('path');
const puppeteer = require('puppeteer');
const ejs = require('ejs');
const bodyParser = require('body-parser');

const fs = require('fs');

const app = express();
const PORT = 3000;


// this pdf-project is for test purposes

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Middleware to serve static files
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Ensure the 'pdfs' directory exists
const pdfDir = path.join(__dirname, 'pdfs');
if (!fs.existsSync(pdfDir)) {
    fs.mkdirSync(pdfDir);
}

// Sample student data
const students = [
    { name: 'Alice', age: 20, grade: 'A' },
    { name: 'Bob', age: 22, grade: 'B' },
    { name: 'Charlie', age: 23, grade: 'A+' },
    { name: 'David', age: 21, grade: 'B+' },
    { name: 'Eve', age: 20, grade: 'A-' },
    { name: 'Alice', age: 20, grade: 'A' },
    { name: 'Bob', age: 22, grade: 'B' },
    { name: 'Charlie', age: 23, grade: 'A+' },
    { name: 'David', age: 21, grade: 'B+' },
    { name: 'Eve', age: 20, grade: 'A-' },
    { name: 'Alice', age: 20, grade: 'A' },
    { name: 'Bob', age: 22, grade: 'B' },
    { name: 'Charlie', age: 23, grade: 'A+' },
    { name: 'David', age: 21, grade: 'B+' },
    { name: 'Eve', age: 20, grade: 'A-' },
    { name: 'Alice', age: 20, grade: 'A' },
    { name: 'Bob', age: 22, grade: 'B' },
    { name: 'Charlie', age: 23, grade: 'A+' },
    { name: 'David', age: 21, grade: 'B+' },
    { name: 'Eve', age: 20, grade: 'A-' },
    { name: 'Alice', age: 20, grade: 'A' },
    { name: 'Bob', age: 22, grade: 'B' },
    { name: 'Charlie', age: 23, grade: 'A+' },
    { name: 'David', age: 21, grade: 'B+' },
    { name: 'Eve', age: 20, grade: 'A-' },
    { name: 'Alice', age: 20, grade: 'A' },
    { name: 'Bob', age: 22, grade: 'B' },
    { name: 'Charlie', age: 23, grade: 'A+' },
  
];

// Route to render the student list
app.get('/', (req, res) => {
    res.render('page_two', {
        pageNo: 9, reportNumber: "ABC001", dateTime: "Thursday 29th August, 2019 | 13:44",
        chartData: [9, 11, 20, 20, 10, 30]

    });
});

// Route to generate PDF
app.post('/download-pdf', async (req, res) => {
    const { students } = req.body;
    console.log('students: ', students)
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const htmlContent = await ejs.renderFile(path.join(__dirname, 'views', 'page_two.ejs'),
        {
            pageNo: 9, reportNumber: "ABC001", dateTime: "Thursday 29th August, 2019 | 13:44",
            chartData: [9, 11, 20, 20, 10, 30]

        });

    const css = fs.readFileSync(path.join(__dirname, 'public', 'new_style.css'), 'utf8');

    // Ensure printBackground is set to true
    await page.setContent(htmlContent.replace('</head>', `<style>${css}</style></head>`), { waitUntil: 'networkidle0' });

    const pdfFilePath = path.join(pdfDir, 'student_list.pdf');

    await page.pdf({ path: pdfFilePath, format: 'A4', printBackground: true });

    await browser.close();

    res.send(`PDF generated successfully! You can find it at: <a href="/pdfs/student_list.pdf">Download PDF</a>`);
});





// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
