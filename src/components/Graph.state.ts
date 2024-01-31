import { Core, NodeSingular, Singular } from "cytoscape"
import { EdgeHandlesInstance } from "cytoscape-edgehandles"
import { atom } from "jotai"

export const pointBeingMadeAtom = atom<NodeSingular | null>(null)

export const cytoscapeAtom = atom<Core | null>(null)

export const edgeHandlesAtom = atom<EdgeHandlesInstance | null>(null)

export const selectedElementAtom = atom<Singular | null>(null)