import { describe, expect, it } from 'vitest'
import { FULL_VIEW } from './unlk'
import { UnlkViewModel, type UnlkFieldData } from './unlk-view'

const fields: UnlkFieldData[] = [
  { key: '2:2:45:80', rect: [118, 14, 80, 4], elements: [[1000, 'Document. Type Name.Text', '/elements/1000']] },
  { key: '4:4:63:80', rect: [118, 23, 80, 4], elements: [[1004, 'Document. Identifier', '/elements/1004'], [1128, 'Despatch Note', '/elements/1128']] },
]

describe('UnlkViewModel', () => {
  it('starts at full view, unselected, unfiltered', () => {
    const vm = new UnlkViewModel(fields)
    expect(vm.viewBox).toEqual(FULL_VIEW)
    expect(vm.selected).toBeNull()
    expect(vm.isFiltered).toBe(false)
  })

  it('pans by pixel delta, scaled to viewport', () => {
    const vm = new UnlkViewModel(fields)
    vm.zoomCenter(3) // must zoom in before panning (clamped at full view)
    const before = vm.viewBox.x
    vm.pan(-64, 0, 375)
    expect(vm.viewBox.x).toBeLessThan(before)
  })

  it('zooms at a point and reports level', () => {
    const vm = new UnlkViewModel(fields)
    expect(vm.zoomLevel).toBe(1)
    vm.zoomCenter(2)
    expect(vm.zoomLevel).toBeGreaterThan(1.9)
    expect(vm.canZoomOut).toBe(true)
    expect(vm.canZoomIn).toBe(true)
  })

  it('clamps at max zoom', () => {
    const vm = new UnlkViewModel(fields)
    for (let i = 0; i < 30; i++) vm.zoomCenter(2)
    expect(vm.canZoomIn).toBe(false)
  })

  it('resets to full view', () => {
    const vm = new UnlkViewModel(fields)
    vm.zoomCenter(3)
    vm.pan(50, 50, 375)
    vm.select('4:4:63:80')
    vm.reset()
    expect(vm.viewBox).toEqual(FULL_VIEW)
    expect(vm.selected).toBeNull()
  })

  it('selects a field and fits to its rect', () => {
    const vm = new UnlkViewModel(fields)
    vm.select('4:4:63:80')
    expect(vm.selected).toBe('4:4:63:80')
    expect(vm.viewBox.w).toBeLessThan(FULL_VIEW.w)
  })

  it('filters fields by tag and name', () => {
    const vm = new UnlkViewModel(fields)
    expect(vm.fieldMatches('2:2:45:80')).toBe(true)
    expect(vm.fieldMatches('4:4:63:80')).toBe(true)

    vm.setFilter('1000')
    expect(vm.fieldMatches('2:2:45:80')).toBe(true)
    expect(vm.fieldMatches('4:4:63:80')).toBe(false)

    vm.setFilter('despatch')
    expect(vm.fieldMatches('2:2:45:80')).toBe(false)
    expect(vm.fieldMatches('4:4:63:80')).toBe(true)

    vm.setFilter('')
    expect(vm.isFiltered).toBe(false)
    expect(vm.fieldMatches('2:2:45:80')).toBe(true)
  })
})
