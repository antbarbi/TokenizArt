import React from 'react';

const ContractForm = ({ inputAddress, setInputAddress, handleAddressSubmit, status, loading }) => {
  return (
    <div className="App flex flex-col items-center" style={{ paddingTop: '25vh' }}>
      <h2 className="mb-4">Enter Contract Address</h2>
      <form onSubmit={handleAddressSubmit} className="flex flex-col items-center">
        <input
          type="text"
          value={inputAddress}
          onChange={(e) => setInputAddress(e.target.value)}
          placeholder="0x..."
          required
          className="mb-4 px-4 py-2 border border-gray-300 rounded"
        />
        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? 'Checking...' : 'Submit'}
        </button>
      </form>
      {status && <div className="mt-4" style={{ color: 'red' }}>{status}</div>}
    </div>
  );
};

export default ContractForm;
