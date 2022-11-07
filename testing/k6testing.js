import http from 'k6/http';
import { sleep, check, group } from 'k6';

export const options = {
  vus: 1000, // Virtual Users
  duration: '20s'
};

const allProducts = `http://localhost:3001/products?page=${Math.floor(Math.random() * 200)}&count=${Math.floor(Math.random() * 100)}`;
const product = `http://localhost:3001/products/${Math.floor(Math.random() * 1000000) + 1}`;
const styles = `http://localhost:3001/products/${Math.floor(Math.random() * 1000000) + 1}/styles`;
const related = `http://localhost:3001/products/${Math.floor(Math.random() * 1000000) + 1}/related`;


export default function test() {
  group('getAllProducts', () => {
    const allProductsResponse = http.get(allProducts);
    check(allProductsResponse, {
    'transaction time 10ms': (r) => r.timings.duration < 10,
    'transaction time 50ms': (r) => r.timings.duration < 50,
    'transaction time 200ms': (r) => r.timings.duration < 200,
    'transaction time 500ms': (r) => r.timings.duration < 500,
    'transaction time 1000ms': (r) => r.timings.duration < 1000,
    'transaction time 2000ms': (r) => r.timings.duration < 2000,
    'transaction time 5000ms': (r) => r.timings.duration < 5000,
    'transaction time 10s': (r) => r.timings.duration < 10000,
    'transaction time 20s': (r) => r.timings.duration < 20000,
    });
  });
  group('getProduct', () => {
    const getProductResponse = http.get(product);
    check(getProductResponse, {
      'transaction time 10ms': (r) => r.timings.duration < 10,
      'transaction time 50ms': (r) => r.timings.duration < 50,
      'transaction time 200ms': (r) => r.timings.duration < 200,
      'transaction time 500ms': (r) => r.timings.duration < 500,
      'transaction time 1000ms': (r) => r.timings.duration < 1000,
      'transaction time 2000ms': (r) => r.timings.duration < 2000,
      'transaction time 5000ms': (r) => r.timings.duration < 5000,
      'transaction time 10s': (r) => r.timings.duration < 10000,
      'transaction time 20s': (r) => r.timings.duration < 20000,
    });
  });
  group('getStyles', () => {
    const stylesResponse = http.get(styles);
    check(stylesResponse, {
    'transaction time 10ms': (r) => r.timings.duration < 10,
    'transaction time 50ms': (r) => r.timings.duration < 50,
    'transaction time 200ms': (r) => r.timings.duration < 200,
    'transaction time 500ms': (r) => r.timings.duration < 500,
    'transaction time 1000ms': (r) => r.timings.duration < 1000,
    'transaction time 2000ms': (r) => r.timings.duration < 2000,
    'transaction time 5000ms': (r) => r.timings.duration < 5000,
    'transaction time 10s': (r) => r.timings.duration < 10000,
    'transaction time 20s': (r) => r.timings.duration < 20000,
    });
  });
  group('related', () => {
    const relatedResponse = http.get(related);
    check(relatedResponse, {
      'transaction time 10ms': (r) => r.timings.duration < 10,
      'transaction time 50ms': (r) => r.timings.duration < 50,
      'transaction time 200ms': (r) => r.timings.duration < 200,
      'transaction time 500ms': (r) => r.timings.duration < 500,
      'transaction time 1000ms': (r) => r.timings.duration < 1000,
      'transaction time 2000ms': (r) => r.timings.duration < 2000,
      'transaction time 5000ms': (r) => r.timings.duration < 5000,
      'transaction time 10s': (r) => r.timings.duration < 10000,
      'transaction time 20s': (r) => r.timings.duration < 20000,
    });
  });
}