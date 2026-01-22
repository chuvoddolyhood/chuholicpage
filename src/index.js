import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);



<?xml version="1.0" encoding="UTF-8"?>
<jasperReport
        xmlns="http://jasperreports.sourceforge.net/jasperreports"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://jasperreports.sourceforge.net/jasperreports
        http://jasperreports.sourceforge.net/xsd/jasperreport.xsd"
        name="phieu_thu_tiet_kiem"
        pageWidth="595"
        pageHeight="842"
        columnWidth="555"
        leftMargin="20"
        rightMargin="20"
        topMargin="20"
        bottomMargin="20"
        uuid="d4b8e7b1-4b58-4d2f-9e88-111111111111">

    <!-- ================== Fields ================== -->
    <field name="kyHan" class="java.lang.String"/>
    <field name="maGd" class="java.lang.String"/>
    <field name="nghiepVu" class="java.lang.String"/>
    <field name="soGiaoDich" class="java.lang.String"/>
    <field name="soChungTu" class="java.lang.String"/>
    <field name="taiKhoanNo" class="java.lang.String"/>
    <field name="taiKhoanCo" class="java.lang.String"/>
    <field name="soTien" class="java.math.BigDecimal"/>

    <!-- ================== Variable ================== -->
    <variable name="sumSoTienByKyHan" class="java.math.BigDecimal" resetType="Group" resetGroup="KyHanGroup" calculation="Sum">
        <variableExpression><![CDATA[$F{soTien}]]></variableExpression>
    </variable>

    <!-- ================== Group ================== -->
    <group name="KyHanGroup">
        <groupExpression><![CDATA[$F{kyHan}]]></groupExpression>

        <!-- Group Header: Hiển thị Loại kỳ hạn -->
        <groupHeader>
            <band height="20">
                <textField>
                    <reportElement x="0" y="0" width="555" height="20"/>
                    <textElement>
                        <font isBold="true"/>
                    </textElement>
                    <textFieldExpression><![CDATA["Loại kỳ hạn: " + $F{kyHan}]]></textFieldExpression>
                </textField>
            </band>
        </groupHeader>

        <!-- Group Footer: Tổng cộng theo loại kỳ hạn -->
        <groupFooter>
            <band height="20">
                <staticText>
                    <reportElement x="0" y="0" width="435" height="20"/>
                    <textElement textAlignment="Right">
                        <font isBold="true"/>
                    </textElement>
                    <text><![CDATA[Tổng cộng theo loại kỳ hạn:]]></text>
                </staticText>

                <textField pattern="#,##0">
                    <reportElement x="435" y="0" width="120" height="20"/>
                    <textElement textAlignment="Right">
                        <font isBold="true"/>
                    </textElement>
                    <textFieldExpression><![CDATA[$V{sumSoTienByKyHan}]]></textFieldExpression>
                </textField>
            </band>
        </groupFooter>
    </group>

    <!-- ================== Title ================== -->
    <title>
        <band height="50">
            <staticText>
                <reportElement x="0" y="10" width="555" height="30"/>
                <textElement textAlignment="Center">
                    <font size="16" isBold="true"/>
                </textElement>
                <text><![CDATA[LIỆT KÊ KIỂM PHIẾU THU TIẾT KIỆM]]></text>
            </staticText>
        </band>
    </title>

    <!-- ================== Column Header ================== -->
    <columnHeader>
        <band height="25">
            <staticText><reportElement x="0" y="0" width="60" height="25"/><text><![CDATA[Loại kỳ hạn]]></text></staticText>
            <staticText><reportElement x="60" y="0" width="70" height="25"/><text><![CDATA[Mã GD]]></text></staticText>
            <staticText><reportElement x="130" y="0" width="70" height="25"/><text><![CDATA[Nghiệp vụ]]></text></staticText>
            <staticText><reportElement x="200" y="0" width="80" height="25"/><text><![CDATA[Số giao dịch]]></text></staticText>
            <staticText><reportElement x="280" y="0" width="60" height="25"/><text><![CDATA[Số CT]]></text></staticText>
            <staticText><reportElement x="340" y="0" width="70" height="25"/><text><![CDATA[TK Nợ]]></text></staticText>
            <staticText><reportElement x="410" y="0" width="70" height="25"/><text><![CDATA[TK Có]]></text></staticText>
            <staticText><reportElement x="480" y="0" width="75" height="25"/><text><![CDATA[Số tiền]]></text></staticText>
        </band>
    </columnHeader>

    <!-- ================== Detail ================== -->
    <detail>
        <band height="20">
            <textField><reportElement x="0" y="0" width="60" height="20"/><textFieldExpression><![CDATA[$F{kyHan}]]></textFieldExpression></textField>
            <textField><reportElement x="60" y="0" width="70" height="20"/><textFieldExpression><![CDATA[$F{maGd}]]></textFieldExpression></textField>
            <textField><reportElement x="130" y="0" width="70" height="20"/><textFieldExpression><![CDATA[$F{nghiepVu}]]></textFieldExpression></textField>
            <textField><reportElement x="200" y="0" width="80" height="20"/><textFieldExpression><![CDATA[$F{soGiaoDich}]]></textFieldExpression></textField>
            <textField><reportElement x="280" y="0" width="60" height="20"/><textFieldExpression><![CDATA[$F{soChungTu}]]></textFieldExpression></textField>
            <textField><reportElement x="340" y="0" width="70" height="20"/><textFieldExpression><![CDATA[$F{taiKhoanNo}]]></textFieldExpression></textField>
            <textField><reportElement x="410" y="0" width="70" height="20"/><textFieldExpression><![CDATA[$F{taiKhoanCo}]]></textFieldExpression></textField>
            <textField pattern="#,##0">
                <reportElement x="480" y="0" width="75" height="20"/>
                <textElement textAlignment="Right"/>
                <textFieldExpression><![CDATA[$F{soTien}]]></textFieldExpression>
            </textField>
        </band>
    </detail>

    <!-- ================== Summary (Chữ ký) ================== -->
    <summary>
        <band height="80">
            <staticText><reportElement x="0" y="20" width="120" height="20"/><text><![CDATA[Kế toán]]></text></staticText>
            <staticText><reportElement x="140" y="20" width="120" height="20"/><text><![CDATA[Thủ quỹ]]></text></staticText>
            <staticText><reportElement x="280" y="20" width="120" height="20"/><text><![CDATA[Kiểm toán]]></text></staticText>
            <staticText><reportElement x="420" y="20" width="120" height="20"/><text><![CDATA[Lãnh đạo]]></text></staticText>
        </band>
    </summary>

</jasperReport>