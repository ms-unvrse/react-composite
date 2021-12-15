# react-composite

Have you ever thought many of React components break [SRP - Single Responsibility Principle](https://en.wikipedia.org/wiki/Single-responsibility_principle).

A class/module/function should have only one reason to change. I know SRP is very subjective,
and it's about people finding their own reasons for modifications.

How about separating layout and bound components? Under "bound components" I mean those connected with a state (internal or props).
It turns out you want to change layouts much more often comparing to adjusting components behavior. 

This lib aims to make React layouts the first class citizen in React apps composition.

## NX

This library was generated with [Nx](https://nx.dev).

Run `nx test react-composite` to execute the unit tests via [Jest](https://jestjs.io).
