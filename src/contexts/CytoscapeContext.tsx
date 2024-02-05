"use client";

import Cytoscape from "cytoscape";
import edgeHandlesExtension from "cytoscape-edgehandles";
// @ts-expect-error
import eulerExtension from "cytoscape-euler";
import popperExtension from "cytoscape-popper";
import { PropsWithChildren, createContext, useContext, useEffect } from "react";

let hasMountedBefore = false;

export const CytoscapeContext = createContext({ initialized: false });

export const CytoscapeProvider = ({ children }: PropsWithChildren) => {
	useEffect(() => {
		if (hasMountedBefore) return;

		Cytoscape.use(eulerExtension);
		Cytoscape.use(popperExtension);
		Cytoscape.use(edgeHandlesExtension);

		// This is a workaround to prevent loading the extensions multiple times on hot-reload
		hasMountedBefore = true;
	}, []);

	return (
		<CytoscapeContext.Provider value={{ initialized: true }}>
			{children}
		</CytoscapeContext.Provider>
	);
};

export const useAssertCytoscapeExtensionsLoaded = () => {
	const { initialized } = useContext(CytoscapeContext);
	if (!initialized)
		throw new Error("must be used inside a CytoscapeProvider component");
};
