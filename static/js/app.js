// set the dimensions and margins of the graph
var margin = { top: 10, right: 100, bottom: 30, left: 30 },
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

const json_path = '/data/samples.json'; // JSON path for data retrieval


// append an svg object to the reserved 'bar' div
var svg = d3.select('#bar')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform',
        'translate(' + margin.left + ',' + margin.top + ')');

// Initialize with default plots
function init() {
    var bar_data = [{
        x: Array(10).keys,
        y: Array(10).keys,
        type: 'bar'
    }];
    var bar_layout = {
        title: 'Bars',
        showlegend: false,
        // height: 600,
        // width: 600
    };
    Plotly.newPlot('bar', bar_data, bar_layout);

    var bubble_data = [{
        x: [1, 2, 3, 4],
        y: [10, 11, 12, 13],
        mode: 'markers',
        marker: {
            size: [40, 60, 80, 100],
            color: ['rgb(93, 164, 214)', 'rgb(255, 144, 14)', 'rgb(44, 160, 101)', 'rgb(255, 65, 54)']
        }
    }]
    var bubble_layout = {
        title: 'Bubbles',
        showlegend: false,
        // height: 600,
        // width: 600
    };

    Plotly.newPlot('gauge', bubble_data, bubble_layout);
}

// 1. Use D3 to read in `samples.json`.
d3.json(json_path).then(function (json_data) {
    const subj_data = json_data.samples;

    // add possible subjects to the dropdown menu
    var subjects = json_data.names
    d3.select('#selDataset')
        .selectAll('myOptions')
        .data(subjects)
        .enter()
        .append('option') //adds options
        .text(function (d) { return d; }) // text shown in the menu
        .attr('value', function (d) { return d; }) // corresponding value returned

    // When the dropdown is changed, run update chart function
    d3.select('#selDataset').on('change', function (d) {
        // recover the chosen option
        var selectedOption = d3.select(this).property('value');
        update(selectedOption);
    })

    // Create horizontal bar chart to display the top 10 OTUs found in selected individual.
    function update(selection) {
        var culture_amounts = [];
        var individual_data = [];
        var culture_amounts = [];
        var culture_ids = [];
        var id_num = [];
        var otu_labels = [];

        // Get data associated with selection
        subj_data.forEach(function (entry) {
            if (entry.id == selection) {
                individual_data = Object.entries(entry);
                culture_amounts = individual_data[2][1]
                culture_ids = individual_data[1][1]
                id_num = individual_data[1][1]
                otu_labels = individual_data[3][1]
            }
        })

        var bar_data = [{
            type: 'bar',
            x: culture_amounts.slice(0, 10), // returns first ten culture amounts as X axis (data is already sorted)
            y: culture_ids.slice(0, 10), // Use `otu_ids` as the labels for the bar chart returns first ten types of culture on Y axis
            text: otu_labels.slice(0, 10), // Use `otu_labels` as the hovertext for the chart.
            orientation: 'h'
        }];
        var bar_layout = {
            title: `Subject ${id_num} OTU Presence`,
            showlegend: false,
            xaxis: { title: 'Culture Amount' },
            yaxis: { title: 'OTU IDs' }
        }

        Plotly.restyle('bar', bar_data, bar_layout); // restyle bar chart


        // Create a bubble chart that displays each sample.
        var bubble_data = [{
            x: culture_ids, // * Use `otu_ids` for the x values.
            y: culture_amounts, // * Use `sample_values` for the y values.
            mode: 'markers',
            marker: {
                size: culture_amounts,        // * Use `sample_values` for the marker size.
                color: color_generator(individual_data)
            },        // * Use `otu_ids` for the marker colors.
            text: otu_labels // * Use `otu_labels` for the text values.
        }]
        var bubble_layout = {
            title: 'Marker Size',
            showlegend: false,
            // height: 600,
            // width: 600
        };

        Plotly.newPlot('gauge', bubble_data, bubble_layout);

    }
    function color_generator(subject) {

        // [`rgb(93, 164, 214)', 'rgb(255, 144, 14)', 'rgb(44, 160, 101)', 'rgb(255, 65, 54)`]
    }
});

init();

