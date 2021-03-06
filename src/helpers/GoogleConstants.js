export const GoogleConstants = {
    zoomScale: zoomScales()
}

function zoomScales() {
    return {
        22: { gScale : 1 },
        21: { gScale : 2 },
        20: { gScale : 10 },
        19: { gScale : 50 },
        18: { gScale : 20 },
        17: { gScale : 50 },
        16: { gScale : 100 },
        15: { gScale : 200 },
        14: { gScale : 200 },
        13: { gScale : 500 },
        12: { gScale : 1000 },
        11: { gScale : 2000 },
        10: { gScale : 5000 },
        9: { gScale : 10000 },
        8: { gScale : 20000 },
        7: { gScale : 50000 },
        6: { gScale : 100000 },
        5: { gScale : 200000 },
        4: { gScale : 500000 },
        3: { gScale : 1000000 }
    }
}