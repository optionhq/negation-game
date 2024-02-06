import { NodeSingular, Singular } from "cytoscape";
import { atom } from "jotai";

export const pointBeingMadeAtom = atom<NodeSingular | null>(null);

export const selectedElementAtom = atom<Singular | null>(null);
