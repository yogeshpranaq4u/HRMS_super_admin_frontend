import React from "react";
import "./AdminBilling.css";
import Logo from "../../Assets/logoNew.png";
import Sign from "../../Assets/sign.png";
const AdminBilling = ({ subtotal, discount, totalPrice, data,data1,discountPrice ,customerSymbol,address}) => {
 
  const convertNumberToWords=(n)=> {
    if (n < 0)
        return false;
    
    // Arrays to hold words for single-digit, double-digit, and below-hundred numbers
    let single_digit = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine']
    let double_digit = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen']
    let below_hundred = ['Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']
    
    if (n === 0) return 'Zero';
    
    // Recursive function to translate the number into words
    function translate(n) {
        let word = "";
        if (n < 10) {
            word = single_digit[n] + ' ';
        } else if (n < 20) {
            word = double_digit[n - 10] + ' ';
        } else if (n < 100) {
            let rem = translate(n % 10);
            word = below_hundred[(n - n % 10) / 10 - 2] + ' ' + rem;
        } else if (n < 1000) {
            word = single_digit[Math.trunc(n / 100)] + ' Hundred ' + translate(n % 100);
        } else if (n < 1000000) {
            word = translate(parseInt(n / 1000)).trim() + ' Thousand ' + translate(n % 1000);
        } else if (n < 1000000000) {
            word = translate(parseInt(n / 1000000)).trim() + ' Million ' + translate(n % 1000000);
        } else {
            word = translate(parseInt(n / 1000000000)).trim() + ' Billion ' + translate(n % 1000000000);
        }
        return word;
    }
    
    // Get the result by translating the given number
    let result = translate(n);
    return result.trim() + '.';
}
  
  return (
    <div className="invoice-container">
      <div className="invoice-header">
        <div
          style={{
            width: "25%",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
          }}
        >
          <img src={Logo} width={180} alt="Logo" />
        </div>
        <div
          style={{
            width: "45%",
            height: "100%",
            marginLeft: 20,
          }}
        >
          <h2 style={{ fontSize: 16, color: "black", fontWeight: "700" }}>
            Cyber Vision Infotech Private Limited
          </h2>
          <p style={{ fontSize: 12, color: "black", fontWeight: "500" }}>
            Company ID : U72200HR2021PTC098138
          </p>
          <p style={{ fontSize: 12, color: "black", fontWeight: "500" }}>
            Address : 2nd Floor, Plot No 94B,
          </p>
          <p style={{ fontSize: 12, color: "black", fontWeight: "500" }}>
            Udyog Vihar, Phase 5
          </p>
          <p style={{ fontSize: 12, color: "black", fontWeight: "500" }}>
            Gurugram, Haryana, 122016,
          </p>
          <p style={{ fontSize: 12, color: "black", fontWeight: "500" }}>
            India
          </p>
          <p style={{ fontSize: 12, color: "black", fontWeight: "500" }}>
            GSTIN : 06AAJCC8076G1ZF
          </p>
        </div>
        <div
          style={{
            justifyContent: "flex-end",
            alignItems: "flex-end",
            display: "flex",
            width: "30%",
            height: "100%",
            paddingTop: 100,
          }}
        >
          <h1 style={{ fontSize: 20, fontWeight: "700", color: "black" }}>
            TAX INVOICE
          </h1>
        </div>
      </div>
      <div
        style={{
          width: "100%",
          height: 1,
          background: "black",
          // marginTop: -25,
          display: "flex",
        }}
      />
      <div
        style={{
          width: "100%",
          height: 90,
          flexDirection: "row",
          display: "flex",
        }}
      >
        <div
          style={{
            width: "49.5%",
            height: "100%",
          }}
        >
          <div style={{ marginLeft: -10, display: "flex", marginTop: -10 }}>
            <div className="subtotal-container">
              <div className="subtotal-label">
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: "500",
                    color: "black",
                    marginLeft: 5,
                  }}
                >
                 # Invoice
                </span>
              </div>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: "600",
                  color: "black",
                  marginLeft:60,
                }}
              >
                : {data1?.invoice}
              </span>
            </div>
          </div>
          <div style={{ marginLeft: -10, display: "flex", marginTop: -18 }}>
            <div className="subtotal-container">
              <div className="subtotal-label">
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: "500",
                    color: "black",
                    marginLeft: 5,
                  }}
                >
                  Invoice Date
                </span>
              </div>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: "600",
                  color: "black",
                  marginLeft:40,
                }}
              >
                : {data1?.invoiceDate}
              </span>
            </div>
          </div>
          <div style={{ marginLeft: -10, display: "flex", marginTop: -18 }}>
            <div className="subtotal-container">
              <div className="subtotal-label">
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: "500",
                    color: "black",
                    marginLeft: 5,
                  }}
                >
                Terms
                </span>
              </div>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: "600",
                  color: "black",
                  marginLeft:75,
                }}
              >
                : Due on Receipt
              </span>
            </div>
          </div>
          <div style={{ marginLeft: -10, display: "flex", marginTop: -18 }}>
            <div className="subtotal-container">
              <div className="subtotal-label">
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: "500",
                    color: "black",
                    marginLeft: 5,
                  }}
                >
                 Due Date
                </span>
              </div>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: "600",
                  color: "black",
                  marginLeft: 57,
                }}
              >
                : {data1?.dueDate}
              </span>
            </div>
          </div>
        </div>
        <div
          style={{
            width: "0.05%",
            height: "100%",
            background: "black",
            flexDirection: "row",
            display: "flex",
          }}
        />

        <div
          style={{
            width: "49.5%",
            height: "100%",
          }}
        >
          <div style={{ marginLeft: -10, display: "flex", marginTop: -10 }}>
            <div className="subtotal-container">
              <div className="subtotal-label">
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: "500",
                    color: "black",
                    marginLeft: 5,
                  }}
                >
                  Place Of Supply
                </span>
              </div>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: "700",
                  color: "black",
                  marginLeft: 50,
                }}
              >
                : Haryana (06)
              </span>
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          width: "100%",
          height: 0.5,
          background: "black",

          display: "flex",
        }}
      />
      <div
        style={{
          width: "100%",
          height: 25,
          background: "#f2f3f4",
          paddingLeft: 10,
          display: "flex",
        }}
      >
        <h2 style={{ color: "black", fontWeight: "600" }}>Bill To</h2>
      </div>
      <div
        style={{
          width: "100%",
          height: 0.5,
          background: "black",

          display: "flex",
        }}
      />

      <div className="invoice-billing">
        <div style={{ paddingLeft: 10 }}>
          <p style={{ fontSize: 14, color: "black", fontWeight: "700" }}>
         {address?.customerName} 
          </p>
          <p style={{ fontSize: 14, color: "black", fontWeight: "700" }}>
        {address?.companyName}
          </p>
          <p style={{ fontSize: 12, color: "black", fontWeight: "500" }}>
          {address?.address}
          </p>
          <p style={{ fontSize: 12, color: "black", fontWeight: "500" }}>
          {address?.city} {address?.pincode} {address?.state}
          </p>
          <p style={{ fontSize: 12, color: "black", fontWeight: "500" }}>
          {address?.country}
          </p>
   
        </div>
      </div>
      <div style={{ marginTop: -15 }}>
        <div className="invoice-items">
          <table>
            <thead>
              <tr>
              <th style={{ width: "50px" }}>#</th> {/* Reduced width for SN */}
          <th>Item & Description</th>
          <th style={{ width: "50px" }}>Qty</th> {/* Reduced width for Quantity */}
          <th style={{ width: "150px" }}>Rate</th>
          <th  style={{ width: "150px" }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {/* {data?.map(emp, index) => ({

            })} */}
            {data?.map((emp, index) => (
          <tr key={index}>
            <td style={{ width: "50px" }}>{index + 1}</td> {/* Reduced width for SN */}
            <td>{emp?.item}</td>
            <td style={{ width: "150px" }}>{emp?.quantity}</td> {/* Reduced width for Quantity */}
            <td>{emp?.rate}</td>
            <td>{emp?.amount}</td>
          </tr>
        ))}
          
            </tbody>
          </table>
        </div>
      </div>
      <div
        style={{
          width: "100%",
          flexDirection: "row",
          display: "flex",
        }}
      >
        <div
          style={{
            width: "60%",
            marginTop: -15,
            paddingLeft: 10,
            paddingBottom: 30,
          }}
        >
          <p style={{ fontSize: 12, color: "black", fontWeight: "500" }}>
            Total In Words
          </p>
          <h2 style={{ fontSize: 14, color: "black", fontWeight: "700" }}>
          {customerSymbol} {convertNumberToWords(totalPrice)}
          </h2>
          <p
            style={{
              fontSize: 12,
              color: "black",
              fontWeight: "500",
              marginTop: 20,
              marginBottom: 20,
            }}
          >
            Notes
          </p>
          <p style={{ fontSize: 12, color: "black", fontWeight: "500" }}>
            Invoice to be paid to:
          </p>
          <p style={{ fontSize: 12, color: "black", fontWeight: "500" }}>
            Company Name: Cyber Vision Infotech Private Limited
          </p>
          <p style={{ fontSize: 12, color: "black", fontWeight: "500" }}>
            Bank Account No: 50200060656381
          </p>
          <p style={{ fontSize: 12, color: "black", fontWeight: "500" }}>
            IFSC: HDFC0000485
          </p>
          <p style={{ fontSize: 12, color: "black", fontWeight: "500" }}>
            Swift Code: HDFCINBB
          </p>
          <p style={{ fontSize: 12, color: "black", fontWeight: "500" }}>
            Bank Name: HDFC Bank Limited
          </p>
          <p
            style={{
              fontSize: 12,
              color: "black",
              fontWeight: "500",
              marginTop: 15,
            }}
          >
            Company Address: Second Floor, Plot No 94B, Udyog Vihar Phase 5,
          </p>
          <p style={{ fontSize: 12, color: "black", fontWeight: "500" }}>
            Gurugram, Haryana, ZIP Code: 122016 (INDIA)
          </p>
          <p
            style={{
              fontSize: 12,
              color: "black",
              fontWeight: "500",
              marginTop: 15,
            }}
          >
            Bank Branch Address: Vanijya Kunj, ENKAY SQUARE, No B/1,
          </p>
          <p style={{ fontSize: 12, color: "black", fontWeight: "500" }}>
            Phase IV, Gurugram, Haryana, ZIP Code: 122001 (INDIA)
          </p>
        </div>
        <div
          style={{
            width: "0.05%",
            marginTop: -19,
            background: "black",
            flexDirection: "row",
            display: "flex",
          }}
        />
        <div
          style={{
            width: "39.5%",
            justifyContent: "center",
          }}
        >
          <div style={{ marginTop: -20 }}></div>
          <div className="subtotal-container">
            <div className="subtotal-label">
              <span
                style={{
                  fontSize: 14,
                  fontWeight: "500",
                  color: "black",
                  marginLeft: 80,
                }}
              >
                Sub Total
              </span>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: "500",
                  color: "gray",
                  marginLeft: 60,
                }}
              >
                (Tax Inclusive)
              </span>
            </div>
            <span
              style={{
                fontSize: 14,
                fontWeight: "500",
                color: "black",
                marginTop: -15,
                marginLeft: 60,
              }}
            >
             {customerSymbol} {subtotal}
            </span>
          </div>
          <div style={{ marginTop: -15 }}></div>
          <div className="subtotal-container">
            <div className="subtotal-label">
              <span style={{ fontSize: 14, fontWeight: "500", color: "black" }}>
              {/* {discount} */}
                Discount({discountPrice>0?discountPrice: `${discount}%`})
              </span>
              <span
                style={{ fontSize: 12, fontWeight: "500", color: "gray" }}
              ></span>
            </div>
            <span
              style={{
                fontSize: 14,
                fontWeight: "500",
                color: "black",
                marginTop: -15,
                marginLeft: 50,
              }}
            >
              (-) {customerSymbol}{discountPrice>0?discountPrice:(subtotal * (discount || 0)) / 100}
              {/* {(subtotal * (discount || 0)) / 100} */}
            </span>
          </div>
          <div style={{ marginTop: -15 }}></div>
          <div className="subtotal-container">
            <div className="subtotal-label">
              <span
                style={{
                  fontSize: 14,
                  fontWeight: "700",
                  color: "black",
                  marginLeft: -10,
                  marginBottom: 20,
                }}
              >
                Total
              </span>
            </div>
            <span
              style={{
                fontSize: 14,
                fontWeight: "500",
                color: "black",
                marginTop: 0,
                marginLeft: 50,
                marginBottom: 20,
              }}
            >
             {customerSymbol} {totalPrice}
            </span>
          </div>
          <div style={{ marginTop: -15 }}></div>

          <div style={{ width: "100%", height: 1, background: "#8e8e8e" }} />
          <div style={{ width: "100%", height: 200 }}>
            <div
              style={{
                width: "100%",
                height: "10%",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <h2 style={{ fontSize: 12, color: "black", fontWeight: "500" }}>
                Akash Singh
              </h2>
            </div>
            <div
              style={{
                width: "100%",
                height: "80%",
                justifyContent: "center",
                alignSelf: "center",
                display: "flex",
                paddingTop: 30,
              }}
            >
              <img
                src={Sign}
                alt="Company Logo"
                style={{ width: 250, height: 80, justifyContent: "center" }}
              />
            </div>
            <div
              style={{
                width: "100%",
                height: "10%",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <h2 style={{ fontSize: 12, color: "black", fontWeight: "500" }}>
                Authorized Signature
              </h2>
            </div>
          </div>
          <div style={{ width: "100%", height: 1.5, background: "#8e8e8e" }} />
        </div>
      </div>
     
    </div>
  );
};

export default AdminBilling;
