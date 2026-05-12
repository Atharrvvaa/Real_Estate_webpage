from flask import Flask, request, jsonify
from flask_cors import CORS
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from datetime import datetime
import os
import re

app = Flask(__name__)
CORS(app)

EXCEL_FILE = "leads.xlsx"

HEADERS = ["S.No", "Date & Time", "Client Name", "Requirement", "Budget (Lakhs)", "Mobile Number", "Sales Executive"]

def init_excel():
    if not os.path.exists(EXCEL_FILE):
        wb = openpyxl.Workbook()
        ws = wb.active
        ws.title = "Leads"

        header_font = Font(name="Calibri", bold=True, color="FFFFFF", size=11)
        header_fill = PatternFill("solid", start_color="1A3C5E")
        header_align = Alignment(horizontal="center", vertical="center", wrap_text=True)
        thin = Side(style="thin", color="CCCCCC")
        border = Border(left=thin, right=thin, top=thin, bottom=thin)

        col_widths = [6, 22, 22, 16, 18, 18, 20]
        for i, (header, width) in enumerate(zip(HEADERS, col_widths), start=1):
            cell = ws.cell(row=1, column=i, value=header)
            cell.font = header_font
            cell.fill = header_fill
            cell.alignment = header_align
            cell.border = border
            ws.column_dimensions[openpyxl.utils.get_column_letter(i)].width = width

        ws.row_dimensions[1].height = 30
        ws.freeze_panes = "A2"
        wb.save(EXCEL_FILE)


def get_next_sno():
    wb = openpyxl.load_workbook(EXCEL_FILE)
    ws = wb.active
    return ws.max_row  # row 1 is header, so max_row gives correct S.No


def append_lead(data):
    wb = openpyxl.load_workbook(EXCEL_FILE)
    ws = wb.active
    sno = ws.max_row  # header is row 1, so next entry index = max_row

    thin = Side(style="thin", color="CCCCCC")
    border = Border(left=thin, right=thin, top=thin, bottom=thin)
    even_fill = PatternFill("solid", start_color="EAF1FB")
    odd_fill = PatternFill("solid", start_color="FFFFFF")
    fill = even_fill if sno % 2 == 0 else odd_fill
    align_center = Alignment(horizontal="center", vertical="center")
    align_left = Alignment(horizontal="left", vertical="center")

    row_data = [
        sno,
        datetime.now().strftime("%d-%m-%Y %H:%M"),
        data["clientName"],
        data["requirement"],
        data["budget"],
        data["mobile"],
        data["salesExecutive"],
    ]

    row_num = ws.max_row + 1
    for col, value in enumerate(row_data, start=1):
        cell = ws.cell(row=row_num, column=col, value=value)
        cell.border = border
        cell.fill = fill
        cell.alignment = align_center if col in [1, 2, 4, 5, 7] else align_left

    ws.row_dimensions[row_num].height = 22
    wb.save(EXCEL_FILE)


@app.route("/api/submit", methods=["POST"])
def submit_lead():
    data = request.get_json()

    required = ["clientName", "requirement", "budget", "mobile", "salesExecutive"]
    for field in required:
        if not data.get(field):
            return jsonify({"success": False, "message": f"Missing field: {field}"}), 400

    mobile = str(data["mobile"]).strip()
    if not re.fullmatch(r"[6-9]\d{9}", mobile):
        return jsonify({"success": False, "message": "Invalid mobile number. Must be a 10-digit Indian mobile number."}), 400

    try:
        budget = float(data["budget"])
        if budget <= 0:
            raise ValueError
    except (ValueError, TypeError):
        return jsonify({"success": False, "message": "Budget must be a positive number."}), 400

    init_excel()
    append_lead(data)
    return jsonify({"success": True, "message": "Lead submitted successfully!"})


@app.route("/api/leads", methods=["GET"])
def get_leads():
    init_excel()
    wb = openpyxl.load_workbook(EXCEL_FILE)
    ws = wb.active
    leads = []
    for row in ws.iter_rows(min_row=2, values_only=True):
        if any(cell is not None for cell in row):
            leads.append(dict(zip(HEADERS, row)))
    return jsonify(leads)


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


if __name__ == "__main__":
    init_excel()
    app.run(debug=True, port=5000)
