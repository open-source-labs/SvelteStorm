<script>
    import { scaleBand, scaleLinear } from "d3-scale";
    import { slide } from 'svelte/transition';
    const { ipcRenderer } = require('electron');

    ipcRenderer.on('PERFORMANCE', (event, args) => {
		countObj = args.body.compCounts;
        console.log({countObj})
		populateRerenderCountArr(countObj); 
	});

    let componentRerenderCountArr = []; 
    let countObj;

    const populateRerenderCountArr = (obj) => {
		const tempRenderCountArr = []; 
		for (const key in obj) {
        	tempRenderCountArr.push({
        	      component: key, 
        	      count: obj[key],
        	  }); 
		}
		componentRerenderCountArr = [...tempRenderCountArr];
        console.log({componentRerenderCountArr});
	}
  
    let width = 600;
    let height = 400;
  
    const margin = { top: 20, right: 20, bottom: 20, left: 80 };
    const innerHeight = height - margin.top - margin.bottom;
    const innerWidth = width - margin.left - margin.right;
  
    $: xDomain = componentRerenderCountArr.map((d) => d.component);
    $: yDomain = componentRerenderCountArr.map((d) => +d.count);
  
    $: yScale = scaleBand().domain(xDomain).range([0, innerHeight]).padding(0.1);
    $: xScale = scaleLinear()
      .domain([0, Math.max.apply(null, yDomain)])
      .range([0, innerWidth]);
  
  </script> 
  
  <main>
    <h5 class="graph-title" data-tooltip='Dynamically track re-render counts of Svelte app components.'>Component Rerender Tracker</h5>
      <svg {width} {height} class="chart">
          <g transform={`translate(${margin.left},${margin.top})`}>
            {#each xScale.ticks() as tickValue}
              <g transform={`translate(${xScale(tickValue)},0)`} class="yAxis">
                <line y2={innerHeight} class="line" />
                <text text-anchor="middle" dy=".7em" y={innerHeight + 3} class="tick">
                  {tickValue}
                </text>
              </g>
            {/each}
            {#each componentRerenderCountArr as d}
              <text
              class="tick"
                text-anchor="end"
                x="-3"
                dy=".3em"
                y={yScale(d.component) + yScale.bandwidth() / 2}
              >
                {d.component}
              </text>
              <rect class="bars"
                x="0"
                y={yScale(d.component)}
                width={xScale(d.count)}
                height={yScale.bandwidth()}
                out:slide="{{duration: 1000}}"
              />
            {/each}
          </g>
        </svg>
  </main>
  
  <style> 
  .graph-title {
    color: whitesmoke;
    margin-bottom: 0;
    margin-top: 0;
    padding-top: 50px;
    font-size: 12px;
    position: relative;
  }

  .chart {
    justify-content: center;
    align-items: center;

	}

  .tick {
    font-family: Helvetica, Arial;
    font-size: .725em;
    font-weight: 200;
    fill: #ccc; 
	}

  .line {
    stroke: #e2e2e261; 
    stroke-dasharray: 3
  }

  .bars {
    fill: #8031a7;
    stroke: none;
    opacity: 0.65;
    transition: all 1s;
  }

  .yAxis {
    transition: all 1s;
    fill: #ccc; 
  }


  .graph-title::before,
  .graph-title::after {
    --scale: 0;
    --arrow-size: 10px;
    --tooltip-color: #F3EFEE;

    position: absolute;
    bottom: -.10rem;
    left: 50%;
    transform: translateX(-50%) translateY(var(--translate-y, 0)) scale(var(--scale));
    transition: 150ms transform;
    transform-origin: top center;
  }

  .graph-title::before {
    --translate-y: calc(100% + var(--arrow-size));

    content: attr(data-tooltip);
    font-size: .9rem;
    color: rgb(20, 20, 20);
    padding: .5rem;
    border-radius: .3rem;
    text-align: center;
    width: max-content;
    max-width: 300%;
    background: var(--tooltip-color);
  }

  .graph-title:hover::before,
  .graph-title:hover::after {
    --scale: .8;
  }

  .graph-title::after {
    --translate-y: calc(1 * var(--arrow-size));

    content: '';
    border: var(--arrow-size) solid transparent;
    border-bottom-color: var(--tooltip-color);
    transform-origin: bottom center;
  }
  </style>