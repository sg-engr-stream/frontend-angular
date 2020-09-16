import os
if os.path.exists('node_modules/ag-grid-enterprise/dist/ag-grid-enterprise.cjs.js'):
    with open('node_modules/ag-grid-enterprise/dist/ag-grid-enterprise.cjs.js', 'r') as ag_grid:
        data = ag_grid.read()
        with open('node_modules/ag-grid-enterprise/dist/ag-grid-enterprise.cjs.js', 'w') as w_ag_grid:
            data = data.replace('return isForceWatermark || (isDisplayWatermark && !isWhiteListURL);', 'return false;')
            w_ag_grid.write(data.replace('console.error', '// console.error'))
