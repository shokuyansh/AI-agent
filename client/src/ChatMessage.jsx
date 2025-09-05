import React from 'react';
import ResultsTable from './ResultsTable';
import ExpenseChart from './ExpenseChart';

const LoadingIndicator = () => (
  <div className="loading-indicator">
    <span>Thinking</span>
    <div className="dot one"></div>
    <div className="dot two"></div>
    <div className="dot three"></div>
  </div>
);

const ChatMessage = ({ message }) => {
  const { sender, content, type } = message;

  const renderContent = () => {
    if (type === 'loading') {
      return <LoadingIndicator />;
    }
    
    if (type === 'table') {
      return <ResultsTable data={content} />;
    }

    if (type === 'chart') {
      return (
        <div className="expense-chart-container">
          <ExpenseChart data={content} />
        </div>
      );
    }

     return (
      <div style={{ 
        whiteSpace: "pre-wrap",  
        wordBreak: "break-word",  
        maxWidth: "100%",        
        textAlign: 'left'         
      }}>
        {content}
      </div>
    );
  };

  return (
    <div className={`message-wrapper ${sender}`}>
      <div className={`message ${sender}`}>
        {renderContent()}
      </div>
    </div>
  );
};

export default ChatMessage;