import PDFDocument from 'pdfkit';

export const generateHealthCardPDF = (report) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({
                margin: 50,
                size: 'A4',
                info: {
                    Title: 'Soil Health Card',
                    Author: 'AgriDust - KMC',
                }
            });
            let buffers = [];
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => resolve(Buffer.concat(buffers)));

            // Header Section with Green Accent
            doc.rect(0, 0, doc.page.width, 100).fill('#16a34a');
            doc.fontSize(24).fillColor('#ffffff').text('Soil Health Card', 50, 35, { characterSpacing: 1 });
            doc.fontSize(10).text('Digital Agriculture Intelligence System', 50, 65);
            doc.fontSize(16).text('AgriDust - KMC', 400, 45, { align: 'right' });

            doc.moveDown(5);

            // Farmer Information
            doc.fontSize(18).fillColor('#0f172a').text('Farmer Information', 50, 120);
            doc.lineWidth(1).moveTo(50, 145).lineTo(550, 145).stroke('#e2e8f0');

            doc.moveDown();
            doc.fontSize(11).fillColor('#334155');
            doc.text(`Name: ${report.farmerId?.name || 'N/A'}`, 60, 160);
            doc.text(`Mobile: ${report.farmerId?.phone || 'N/A'}`, 60, 175);
            doc.text(`District: ${report.farmerId?.district || 'N/A'}`, 60, 190);

            doc.text(`Report ID: ${report._id}`, 350, 160);
            doc.text(`Date Issued: ${new Date().toLocaleDateString()}`, 350, 175);
            doc.text(`Soil Status: ${report.soilStatus || 'Pending'}`, 350, 190);

            // Soil Analysis Results Table
            doc.fontSize(18).fillColor('#0f172a').text('Soil Analysis Results', 50, 230);
            doc.lineWidth(1).moveTo(50, 255).lineTo(550, 255).stroke('#e2e8f0');

            const tableTop = 270;
            const col1 = 60;
            const col2 = 250;
            const col3 = 400;

            doc.fontSize(10).fillColor('#64748b').text('PARAMETER', col1, tableTop);
            doc.text('VALUE', col2, tableTop);
            doc.text('IDEAL RANGE', col3, tableTop);

            doc.lineWidth(0.5).moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke('#cbd5e1');

            const row1 = tableTop + 30;
            doc.fillColor('#334155').text('Soil pH Level', col1, row1);
            doc.font('Helvetica-Bold').text(`${report.ph}`, col2, row1).font('Helvetica');
            doc.text('6.5 - 7.5', col3, row1);

            const row2 = row1 + 25;
            doc.text('Nitrogen (N)', col1, row2);
            doc.font('Helvetica-Bold').text(`${report.nitrogen} ppm`, col2, row2).font('Helvetica');
            doc.text('40 - 60 ppm', col3, row2);

            const row3 = row2 + 25;
            doc.text('Phosphorus (P)', col1, row3);
            doc.font('Helvetica-Bold').text(`${report.phosphorus} ppm`, col2, row3).font('Helvetica');
            doc.text('25 - 35 ppm', col3, row3);

            const row4 = row3 + 25;
            doc.text('Potassium (K)', col1, row4);
            doc.font('Helvetica-Bold').text(`${report.potassium} ppm`, col2, row4).font('Helvetica');
            doc.text('180 - 220 ppm', col3, row4);

            const row5 = row4 + 25;
            doc.text('Organic Matter', col1, row5);
            doc.font('Helvetica-Bold').text(`${report.organicMatter || 0} %`, col2, row5).font('Helvetica');
            doc.text('2.5 - 3.5 %', col3, row5);

            // Fertilizer Recommendation Schedule
            doc.fontSize(18).fillColor('#16a34a').text('Fertilizer Recommendation Schedule', 50, 430);
            doc.fontSize(10).fillColor('#334155');

            const schedule = report.recommendedFertilizer || 'Maintenance dosing of NPK only.';
            doc.rect(50, 455, 500, 60).fill('#f8fafc');
            doc.fillColor('#334155').text(schedule, 65, 470, { width: 470, lineGap: 3 });

            // Suitable Crops
            doc.fontSize(18).fillColor('#0f172a').text('Suitable Crops for Your Soil', 50, 540);
            const crops = report.suitableCrops || [];
            doc.fontSize(12).fillColor('#16a34a').text(crops.join('  •  '), 60, 570);
            doc.fontSize(10).fillColor('#64748b').text(`Overall Suitability Score: ${report.suitabilityPct || 90}%`, 60, 590);

            // Footer Section
            doc.rect(0, doc.page.height - 80, doc.page.width, 80).fill('#0f172a');
            doc.fontSize(11).fillColor('#ffffff').text('Next Scheduled Test:', 50, doc.page.height - 55);
            doc.font('Helvetica-Bold').text(report.nextTestDate ? new Date(report.nextTestDate).toLocaleDateString() : 'August 2026', 150, doc.page.height - 55);

            doc.fontSize(9).font('Helvetica').text('Disclaimer: These recommendations are based on the laboratory soil sample provided. Local weather and variety conditions may apply.', 50, doc.page.height - 30, { align: 'center', width: 500 });

            doc.end();
        } catch (error) {
            reject(error);
        }
    });
};
