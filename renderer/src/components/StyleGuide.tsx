import StationLogoLight from './../assets/img/station-logo-light.svg'
import StationLogoDark from './../assets/img/station-logo-dark.svg'

const StyleGuide = () => {
  return (
    <>
      <div className="pt-5 pb-5 flex flex-row">
      <img className="left-0" src={StationLogoLight} width="200px" alt="Station Logo" />
      <img className="left-0 bg-primary" src={StationLogoDark} width="200px" alt="Station Logo" />
      </div>
      <div className="pt-5 pb-5">
        <h1 className="font-title text-header-xxl">Title font</h1>
        <h1 className="font-body text-body-xxl">Body font</h1>
        <h1 className="font-number text-header-l">#012345</h1>
      </div>
      <div className="pt-5 pb-5">
        <h1 className="text-primary text-3xl">Primary Color</h1>
        <h1 className="text-secondary text-3xl">Secondary Color</h1>
        <h1 className="text-accent text-3xl">Accent Color</h1>
        <h1 className="text-secondary-accent text-3xl">Secondary Accent Color</h1>
        <h1 className="text-tertiary-accent text-3xl">Tertiary Accent Color</h1>
        <h2 className="bg-black text-white">Primary dark</h2>
        <h2 className="bg-white text-black">Primary light</h2>
        <h2 className="bg-grayscale-200">Grayscale 200</h2>
        <h2 className="bg-grayscale-300">Grayscale 300</h2>
        <h2 className="bg-grayscale-400">Grayscale 400</h2>
        <h2 className="bg-grayscale-500 text-black">Grayscale 500</h2>
        <h2 className="bg-grayscale-600 text-white">Grayscale 600</h2>
        <h2 className="bg-grayscale-700 text-white">Grayscale 700</h2>
      </div>
      <div className="pt-5 pb-5">
        <h1 className="text-body-xl">Text body xl</h1>
        <h1 className="text-body-xxl">Text body xxl</h1>
      </div>

      <div className="pt-5 pb-5">
        <button className="btn-primary">
          Primary Button
        </button>

        <button className="btn-primary" disabled>
          Primary Button disabled
        </button>

        <button className="btn-primary-small">
          Primary Button small
        </button>

        <button className="btn-primary-small" disabled>
          Primary Button Small disabled
        </button>
      </div>

      <div className="pt-5 pb-5">
        <button className="btn-secondary">
        Secondary Button
        </button>

        <button className="btn-secondary" disabled>
        Secondary Button disabled
        </button>

        <button className="btn-secondary-small">
        Secondary Button small
        </button>

        <button className="btn-secondary-small" disabled>
          Secondary Button Small disabled
        </button>
      </div>

      <div className="pt-5 pb-5">
        <button className="link-primary"> Link Primary  </button>
        <div className="bg-primary p-5">
          <button className="link-primary-dark">Link Primary dark</button>
        </div>
      </div>

      <div className="pt-5 pb-5">
        <p className="p-5 gradient-space-marine text-white">
          Gradient Space - Marine
        </p>

        <p className="p-5 gradient-deep-marine text-white">
          Gradient Deep - Marine
        </p>

        <p className="p-5 gradient-space-turqoise text-white">
          Gradient Space - Turqoise
        </p>

        <p className="p-5 gradient-space-fire text-white">
          Gradient Space - Fire
        </p>

        <p className="p-5 gradient-sun-fire">
          Gradient Sun - Fire
        </p>
      </div>

    </>
  )
}

export default StyleGuide
