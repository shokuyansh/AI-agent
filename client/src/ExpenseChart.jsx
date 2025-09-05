import React from "react";
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const ExpenseChart = ({data})=>{
    if(!data||data.length===0){
        return <p>No data to display chart.</p>;
    }
    const chartData = {
        labels : data.map(item=>item.item),
        datasets:[
            {
                label: 'Amount Spent',
                data: data.map(item=>item.amount),
                backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
          'rgba(255, 159, 64, 0.7)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
            },
        ],
    };
    return(
        <div style={{maxWidth:'400px',margin:'auto'}}>
            <h2>Expenses Breakdown</h2>
            <Pie data={chartData}/>
        </div>
    );
}
export default ExpenseChart;