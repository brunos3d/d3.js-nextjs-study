/* eslint-disable @typescript-eslint/no-use-before-define */
import { HTMLAttributes, MutableRefObject, useEffect, useRef } from 'react';
import cn from 'classnames';
import * as d3 from 'd3';

import styles from './styles.module.css';

export type HeatmapProps = HTMLAttributes<HTMLDivElement>;

export default function Heatmap({ className, ...rest }: HeatmapProps) {
  const rootRef = useRef<SVGSVGElement>() as MutableRefObject<SVGSVGElement>;

  async function render(root: SVGSVGElement) {
    // set the dimensions and margins of the graph
    const margin = { top: 10, right: 30, bottom: 30, left: 60 };
    const width = 460 - margin.left - margin.right;
    const height = 460 - margin.top - margin.bottom;

    const svg = d3
      .select(root)
      .attr(`width`, width + margin.left + margin.right)
      .attr(`height`, height + margin.top + margin.bottom);

    // THIS FUNCTION IS VERY IMPORTANT
    // clear all chart elements, and avoid duplicates
    svg.selectAll(`*`).remove();

    //Read the data
    const data = await d3.csv<'x' | 'y'>(
      `https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_IC.csv`,
    );

    // Add X axis --> it is a date format
    const x = d3.scaleLinear().domain([1, 100]).range([0, width]);
    svg
      .append(`g`)
      .attr(`transform`, `translate(0,` + height + `)`)
      .call(d3.axisBottom(x));

    // Add Y axis
    const y = d3.scaleLinear().domain([0, 13]).range([height, 0]);
    svg.append(`g`).call(d3.axisLeft(y));

    // This allows to find the closest X index of the mouse:
    const bisect = d3.bisector<{ x: number }, number>(function (d) {
      return d.x;
    }).left;

    // Create the circle that travels along the curve of chart
    const focus = svg
      .append(`g`)
      .append(`circle`)
      .style(`fill`, `none`)
      .attr(`stroke`, `black`)
      .attr(`r`, 8.5)
      .style(`opacity`, 0);

    // Create the text that travels along the curve of chart
    const focusText = svg
      .append(`g`)
      .append(`text`)
      .style(`opacity`, 0)
      .attr(`text-anchor`, `left`)
      .attr(`alignment-baseline`, `middle`);

    // Add the line
    svg
      .append(`path`)
      .datum(data)
      .attr(`fill`, `none`)
      .attr(`stroke`, `steelblue`)
      .attr(`stroke-width`, 1.5)
      .attr(
        `d`,
        d3.line(
          (d) => x(+(d.x || 0)),
          (d) => y(+(d.y || 0)),
        ),
      );

    // Create a rect on top of the svg area: this rectangle recovers mouse position
    svg
      .append(`rect`)
      .style(`fill`, `none`)
      .style(`pointer-events`, `all`)
      .attr(`width`, width)
      .attr(`height`, height)
      .on(`mouseover`, mouseover)
      .on(`mousemove`, mousemove)
      .on(`mouseout`, mouseout);

    // What happens when the mouse move -> show the annotations at the right positions.
    function mouseover() {
      focus.style(`opacity`, 1);
      focusText.style(`opacity`, 1);
    }

    function mousemove(event: any) {
      // recover coordinate we need
      const x0 = x.invert(d3.pointer(event)[0]);
      const i = bisect(data as any, x0, 1);
      const selectedData = data[i];

      focus
        .attr(`cx`, x(+(selectedData.x || 0)))
        .attr(`cy`, y(+(selectedData.y || 0)));

      focusText
        .html(`x:` + selectedData.x + `  -  ` + `y:` + selectedData.y)
        .attr(`x`, x(+(selectedData.x || 0)) + 15)
        .attr(`y`, y(+(selectedData.y || 0)));
    }

    function mouseout() {
      focus.style(`opacity`, 0);
      focusText.style(`opacity`, 0);
    }
  }

  useEffect(() => {
    render(rootRef.current);
  }, [rootRef]);

  return (
    <div className={cn(styles.heatmap, className)} {...rest}>
      <svg className={styles.svgRoot} ref={rootRef} />
    </div>
  );
}
