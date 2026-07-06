const ReactDOM = __vite__cjsImport0_reactDom_client;const _jsxDEV = __vite__cjsImport9_react_jsxDevRuntime["jsxDEV"];import __vite__cjsImport0_reactDom_client from "/node_modules/.vite/deps/react-dom_client.js?v=a817d3c8";
import App from "/src/App.jsx?t=1783323901526";
import "/index.css?t=1783323901526";
import "/node_modules/react-loading-skeleton/dist/skeleton.css";
import "/node_modules/react-tooltip/dist/react-tooltip.min.css";
import { BrowserRouter } from "/node_modules/.vite/deps/react-router-dom.js?v=a817d3c8";
import { Provider } from "/node_modules/.vite/deps/react-redux.js?v=a817d3c8";
import { QueryClient, QueryClientProvider } from "/node_modules/.vite/deps/@tanstack_react-query.js?v=a817d3c8";
import store from "/src/store/store.js";
var _jsxFileName = "/Users/imac/Desktop/TotalCtrl/src/main.jsx";
import __vite__cjsImport9_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=a817d3c8";
const queryClient = new QueryClient({ defaultOptions: { queries: {
	staleTime: 1e3 * 60 * 5,
	retry: 1,
	refetchOnWindowFocus: false
} } });
ReactDOM.createRoot(document.getElementById("root")).render(/* @__PURE__ */ _jsxDEV(Provider, {
	store,
	children: /* @__PURE__ */ _jsxDEV(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ _jsxDEV(BrowserRouter, { children: /* @__PURE__ */ _jsxDEV(App, {}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 27,
			columnNumber: 9
		}, this) }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 26,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 25,
		columnNumber: 5
	}, this)
}, void 0, false, {
	fileName: _jsxFileName,
	lineNumber: 24,
	columnNumber: 3
}, this));

//# sourceMappingURL=data:application/json;base64,eyJtYXBwaW5ncyI6IkFBQUEsT0FBTyxjQUFjO0FBRXJCLE9BQU8sU0FBUztBQUNoQixPQUFPO0FBQ1AsT0FBTztBQUNQLE9BQU87QUFFUCxTQUFTLHFCQUFxQjtBQUM5QixTQUFTLGdCQUFnQjtBQUN6QixTQUFTLGFBQWEsMkJBQTJCO0FBQ2pELE9BQU8sV0FBVzs7O0FBRWxCLE1BQU0sY0FBYyxJQUFJLFlBQVksRUFDbEMsZ0JBQWdCLEVBQ2QsU0FBUztDQUNQLFdBQVcsTUFBTyxLQUFLO0NBQ3ZCLE9BQU87Q0FDUCxzQkFBc0I7QUFDeEIsRUFDRixFQUNGLENBQUM7QUFFRCxTQUFTLFdBQVcsU0FBUyxlQUFlLE1BQU0sQ0FBQyxFQUFFLE9BQ25ELHdCQUFDLFVBQUQ7Q0FBaUI7V0FDZix3QkFBQyxxQkFBRDtFQUFxQixRQUFRO1lBQzNCLHdCQUFDLGVBQUQsWUFDRSx3QkFBQyxLQUFELENBQU07Ozs7V0FDTzs7Ozs7Q0FDSTs7Ozs7QUFDYjs7OztRQUNaIiwibmFtZXMiOltdLCJzb3VyY2VzIjpbIm1haW4uanN4Il0sInZlcnNpb24iOjMsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdERPTSBmcm9tICdyZWFjdC1kb20vY2xpZW50JztcblxuaW1wb3J0IEFwcCBmcm9tICcuL0FwcCc7XG5pbXBvcnQgJy4uL2luZGV4LmNzcyc7XG5pbXBvcnQgJ3JlYWN0LWxvYWRpbmctc2tlbGV0b24vZGlzdC9za2VsZXRvbi5jc3MnO1xuaW1wb3J0ICdyZWFjdC10b29sdGlwL2Rpc3QvcmVhY3QtdG9vbHRpcC5jc3MnO1xuXG5pbXBvcnQgeyBCcm93c2VyUm91dGVyIH0gZnJvbSAncmVhY3Qtcm91dGVyLWRvbSc7XG5pbXBvcnQgeyBQcm92aWRlciB9IGZyb20gJ3JlYWN0LXJlZHV4JztcbmltcG9ydCB7IFF1ZXJ5Q2xpZW50LCBRdWVyeUNsaWVudFByb3ZpZGVyIH0gZnJvbSAnQHRhbnN0YWNrL3JlYWN0LXF1ZXJ5JztcbmltcG9ydCBzdG9yZSBmcm9tICcuL3N0b3JlL3N0b3JlJztcblxuY29uc3QgcXVlcnlDbGllbnQgPSBuZXcgUXVlcnlDbGllbnQoe1xuICBkZWZhdWx0T3B0aW9uczoge1xuICAgIHF1ZXJpZXM6IHtcbiAgICAgIHN0YWxlVGltZTogMTAwMCAqIDYwICogNSwgLy8gNSBtaW51dGVzXG4gICAgICByZXRyeTogMSxcbiAgICAgIHJlZmV0Y2hPbldpbmRvd0ZvY3VzOiBmYWxzZSxcbiAgICB9LFxuICB9LFxufSk7XG5cblJlYWN0RE9NLmNyZWF0ZVJvb3QoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jvb3QnKSkucmVuZGVyKFxuICA8UHJvdmlkZXIgc3RvcmU9e3N0b3JlfT5cbiAgICA8UXVlcnlDbGllbnRQcm92aWRlciBjbGllbnQ9e3F1ZXJ5Q2xpZW50fT5cbiAgICAgIDxCcm93c2VyUm91dGVyPlxuICAgICAgICA8QXBwIC8+XG4gICAgICA8L0Jyb3dzZXJSb3V0ZXI+XG4gICAgPC9RdWVyeUNsaWVudFByb3ZpZGVyPlxuICA8L1Byb3ZpZGVyPixcbik7XG4iXX0=