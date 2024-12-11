import React, { Component } from 'react';
import * as d3 from 'd3';

class FileUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      jsonData: null,  // New state to store the parsed JSON data
    };
  }
  
  handleFileSubmit = (event) => {
    event.preventDefault();
    const { file } = this.state;

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        const json = this.csvToJson(text);
        this.setState({ jsonData: json });  // Set JSON to state
        this.props.set_data(json)
      };
      reader.readAsText(file);
    }
  };

  csvToJson = (csv) => {
    const lines = csv.split("\n").filter(line => line.trim()); // Remove empty rows
    const headers = lines[0].split(",").map(header => header.trim()); // Trim headers
    const result = [];
  
    for (let i = 1; i < lines.length; i++) {
      const currentLine = lines[i].split(",").map(value => value.trim()); // Trim each value
      const obj = {};
  
      headers.forEach((header, index) => {
        obj[header] = currentLine[index] || null; // Assign value or null if missing
      });
  
      const parsedObj = {
        age: parseInt(obj.age),
        annual_income: parseFloat(obj['annual_income']),
        monthly_inhand_salary: parseFloat(obj['monthly_inhand_salary']),
        credit_history_age: parseFloat(obj['credit_history_age']),
        total_emi_per_month: parseFloat(obj['total_emi_per_month']),
        num_bank_accounts: parseFloat(obj['num_bank_accounts']),
        num_credit_card: parseFloat(obj['num_credit_card']),
        interest_rate: parseFloat(obj['interest_rate']),
        num_of_loan: parseFloat(obj['num_of_loan']),
        delay_from_due_date: parseFloat(obj['delay_from_due_date']),
        num_of_delayed_payment: parseFloat(obj['num_of_delayed_payment']),
        num_credit_inquiries: parseFloat(obj['num_credit_inquiries']),
        credit_mix: obj['credit_mix'],
        outstanding_debt: parseFloat(obj['outstanding_debt']),
        credit_utilization_ratio: parseFloat(obj['credit_utilization_ratio']),
        payment_of_min_amount: obj['payment_of_min_amount'],
        amount_invested_monthly: parseFloat(obj['amount_invested_monthly']),
        monthly_balance: parseFloat(obj['monthly_balance']),
        credit_score: parseInt(obj['credit_score']) === 0 ? 'Low' : (parseInt(obj['credit_score']) === 1 ? 'Average' : 'High'),
      };
  
      result.push(parsedObj);
    }
    var svg = d3.select('.mySvg');
    const keys = Object.keys(result[0]);
    console.log(keys)

    const tooltip = d3.select('body').append('div') //here
    .attr('class', 'tooltip')
    .style('position', 'absolute')
    .style('visibility', 'hidden')
    .style('background-color', 'darkgrey')
    .style('color', 'white')
    .style('padding', '5px')
    .style('border-radius', '4px')
    .style('pointer-events', 'none');

    svg.selectAll('rect')
    .data(keys)
    .join('rect')
    .attr('width',70)
    .attr('height', 40)
    .attr('fill', 'darkgray')
    .attr('y', 50)
    .attr('x', (d,i)=> i*80)
    .attr('flex', 1)
    .on('mouseover', function(event, d) {
      tooltip.style('visibility', 'visible').html('');
      
      const barMargins = {
        top: 30, bottom: 30, right: 45, left: 40
      }

      const ttHeight = 50;
      const ttWidth = 100;

      var toolTipSVG = tooltip.append('svg').attr('class','tooltip-svg')
      .attr('height',ttHeight+barMargins.top + barMargins.bottom)
      .attr('width',ttWidth + barMargins.left + barMargins.right);

      const barContainer = toolTipSVG.join('g').attr("transform", `translate(${barMargins.left},${barMargins.top})`);
      /*
      var barXScale = d3.scaleBand().domain(barData.map(d => d.mon)).range([0,ttWidth]).padding(0.15);
      var barYScale = d3.scaleLinear().domain([0,d3.max(barData, d => d.num)]).range([ttHeight,0]);

      barContainer.selectAll(".bar-x-axis").data([null]).join('g').attr('class',"bar-x-axis")
        .attr("transform", `translate(${25},${ttHeight+21})`)
        .call(d3.axisBottom(barXScale)).attr('stroke','black').selectAll("path, line")
        .style("stroke", "black");
        
        
      barContainer.selectAll(".bar-y-axis").data([null]).join('g').attr('class',"bar-y-axis")
        .attr("transform", `translate(${25},${20})`)
        .call(d3.axisLeft(barYScale)).attr('stroke','black').selectAll("path, line")
        .style("stroke", "black");



      toolTipSVG.selectAll('rect')
      .data(barData)
      .join('rect')
        .attr('x',d=>barXScale(d.mon))
        .attr('y',d=>barYScale(d.num))
        .attr('width', barXScale.bandwidth())
        .attr('height', d=> ttHeight - barYScale(d.num))
        .attr("transform", `translate(${25},${20})`)
        .attr('fill',oldColor)
        .attr('setting', oldColor = colorsToCompany[d.key])
        .transition()
        .duration(500)
        .attr('fill',colorsToCompany[d.key]);
        
      
      */
    })
    .on('mousemove', function(event) {
      tooltip.style('top', (event.pageY + 10) + 'px').style('left', (event.pageX + 10) + 'px');
    })
    .on('mouseout', function() {
      tooltip.style('visibility', 'hidden')
    });
    
    svg.selectAll('text')
    .data(keys)
    .join('text')
    .attr('x', (d,i)=>35+80*i)
    .attr('y',75)
    .attr('text-anchor', 'middle')
    .text(d=>d)
    .attr('font-size', 8)
    .attr('font-weight','bold')

    //result.sort((a, b) => a.age - b.age);
    //console.log(result);
    return result;
  };

  componentDidUpdate(){

  }
  

  render() {
    return (
      <div className="upload" style={{ backgroundColor: "#f0f0f0", padding: 20, height: 120, display: 'flex', gap: 50}}>
        <div>
        <h2>Upload a CSV File</h2>
        <form onSubmit={this.handleFileSubmit}>
          <input type="file" accept=".csv" onChange={(event) => this.setState({ file: event.target.files[0] })} />
          <button type="submit">Upload</button>
        </form>
        </div>
        <h2>Attributes: </h2>
        <svg className='mySvg' style={{display:"flex", gap:20, flexDirection:'row', width:960}}>

        </svg>
      </div>
    );
  }
}

export default FileUpload;