import React from "react";
import Modal from "react-responsive-modal";
import AdminBilling from "../../AdminBilling";

const PreviewInvoice = ({
  open,
  onClose,
  sunTotal,
  discount,
  discountPrice,
  totalPrice,
  customerSymbol,
  address,
  data,
  data1,
  setSubmitInvoice,
}) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      center
      showCloseIcon={false}
      closeOnOverlayClick={false}
      classNames={{ modal: "custom-modal1" }}
    >

      <AdminBilling
        subtotal={sunTotal}
        discount={discount}
        discountPrice={discountPrice}
        totalPrice={totalPrice}
        customerSymbol={customerSymbol}
        address={address}
        data={data}
        data1={data1}
      />

      <div className="invoice-actions" style={{ marginTop: "20px" }}>
        <button
          className="cancel-btn"
          style={{
                  justifyContent: "flex-end",
                  alignSelf: "flex-end",
                  display: "flex",
                }}
          onClick={() => {
            onClose();
          }}
        >
          Cancel
        </button>
        <button
          className="save-draft-btn"
          onClick={() => {
            setSubmitInvoice("Save As Draft");
            onClose();
          }}
        >
          Save As Draft
        </button>
        <button
          className="save-send-btn"
          onClick={() => {
            setSubmitInvoice("Save And Send");
            onClose();
          }}
          //   onClick={() => handleSubmit({ type: "MailSent" })}
        >
          Save And Send
        </button>
      </div>
    </Modal>
  );
};

export default PreviewInvoice;
