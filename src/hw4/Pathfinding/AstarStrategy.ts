import Stack from "../../Wolfie2D/DataTypes/Collections/Stack";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import NavigationPath from "../../Wolfie2D/Pathfinding/NavigationPath";
import NavPathStrat from "../../Wolfie2D/Pathfinding/Strategies/NavigationStrategy";
import GraphUtils from "../../Wolfie2D/Utils/GraphUtils";
import PQueue from './PQueue';

// TODO Construct a NavigationPath object using A*

interface SearchNode {
    index: number;
    f: number;
}

/**
 * The AstarStrategy class is an extension of the abstract NavPathStrategy class. For our navigation system, you can
 * now specify and define your own pathfinding strategy. Originally, the two options were to use Djikstras or a
 * direct (point A -> point B) strategy. The only way to change how the pathfinding was done was by hard-coding things
 * into the classes associated with the navigation system. 
 * 
 * - Peter
 */
export default class AstarStrategy extends NavPathStrat {

    /**
     * @see NavPathStrat.buildPath()
     */
    public buildPath(to: Vec2, from: Vec2): NavigationPath {
        const start = this.mesh.graph.snap(from);
        const destination = this.mesh.graph.snap(to);
        const graph = this.mesh.graph;

        let openSet = new PQueue<SearchNode>((a, b) => a.f < b.f ? -1 : 1);
        let closedSet = new Set<number>();
    
        let gScores = new Map<number, number>();
        let initialHScore = graph.getNodePosition(start).distanceTo(graph.getNodePosition(destination));
        let fScores = new Map<number, number>();
        let cameFromMap = new Map<number, number>();
    
        gScores.set(start, 0);
        fScores.set(start, initialHScore);
    
        openSet.enqueue({ index: start, f: fScores.get(start) });
    
        while (!openSet.isEmpty()) {
            let current = openSet.dequeue().index;
        
            if (current === destination) {
                let path = new Stack<Vec2>(graph.numVertices);
    
                let current = destination;
                while (cameFromMap.has(current)) {
                    path.push(graph.getNodePosition(current));
                    current = cameFromMap.get(current);
                }
    
                path.push(graph.getNodePosition(start));
    
                return new NavigationPath(path);
            }
    
            closedSet.add(current);
    
            let adjacentEdges = graph.getEdges(current);
            while (adjacentEdges) {
                let neighborNode = adjacentEdges.y;
    
                if (closedSet.has(neighborNode)) {
                    adjacentEdges = adjacentEdges.next;
                    continue;
                }
    
                let tempGScore = gScores.get(current) + adjacentEdges.weight;
    
                if (!openSet.contains(neighborNode) || tempGScore < gScores.get(neighborNode)) {
                    cameFromMap.set(neighborNode, current);
                    gScores.set(neighborNode, tempGScore);
    
                    let hScore = graph.getNodePosition(neighborNode).distanceTo(graph.getNodePosition(destination));
                    fScores.set(neighborNode, tempGScore + hScore);
    
                    if (!openSet.contains(neighborNode)) {
                        openSet.enqueue({ index: neighborNode, f: fScores.get(neighborNode) });
                    }
                }
    
                adjacentEdges = adjacentEdges.next;
            }
        }

        return new NavigationPath(new Stack<Vec2>());
    }
    
}