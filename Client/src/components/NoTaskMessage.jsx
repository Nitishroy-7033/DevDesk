const NoTaskMessage = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          height: "120px",
          width: "120px",
          display: "flex",
          borderRadius: "20px",
          backgroundColor: "#313131ff",
          border: "1px solid #444444",
          padding: "10px",
          fontSize: "60px",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        📂
      </div>

      <div
        style={{
          marginTop: "20px",
          fontSize: "24px",
          textAlign: "center",
        }}
      >
        No Task
      </div>

      <div
        style={{
          fontSize: "18px",
          color: "grey",
          textAlign: "center",
        }}
      >
        Add some task to the list.
      </div>
    </div>
  );
};
export default NoTaskMessage;
