const AboutPage = () => {
    return (
        <div className="bg-gray-100">
            <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8">
                <div className="flex justify-center">
                    <div className="max-w-2xl text-center ">
                        {/* <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">About BigGallery</h2> */}
                        <p className="mt-4 text-gray-600 text-lg">BigGallery showcases a selection of our customers' stores, highlighting their distinct features and functionalities from around the world.</p>
                        <p className="mt-4 text-gray-600 text-lg">Facets, descriptions and keywords have been included to ensure easy searching and filtering of the sites.</p>
                        <p className="mt-4 text-gray-600 text-lg">This gallery serves as an internal resource to find reference cases.</p>
                        <p className="mt-4 text-gray-600 text-lg">Please reach out if you have any feedback or questions. Enjoy the gallery.</p>
                        <p className="mt-4  text-gray-600 text-lg">Mehmet<br/>mehmet.vanli@bigcommerce.com</p>
                        
                        <div className="mt-8">
                            <p className="text-blue-500 text-lg">Still couldn't find what you are looking for?</p>
                            <p className="my-2 text-lg">Check out these other fantastic resources:</p>
                            <ul className="list-none p-0 text-lg">
                                <li><a href="https://docs.google.com/spreadsheets/d/1a2NvW02eJUrjNvsSt0UhGbubxsyLkzVhirvHIqXhNbg/edit#gid=0" target="_blank" className="text-black hover:text-blue-600 font-medium">Example Sites by Category</a></li>
                                <li><a href="https://docs.google.com/spreadsheets/d/1RoKt2m4uSnDS9-VVRB2V20bHneEcfUrMX01hrFpF1OI/edit#gid=1538945425" target="_blank" className="text-black hover:text-blue-600 font-medium">AG Example Sites by Category</a></li>
                                <li><a href="https://docs.google.com/spreadsheets/d/1jj3G7zAGAQP5wmph7N5eGHnED_ZDd1ctKODUINoxCiM/edit#gid=0" target="_blank" className="text-black hover:text-blue-600 font-medium">Roel's Example Sites</a></li>
                                <li><a href="https://www.bigcommerce.com/showcase/" target="_blank" className="text-black hover:text-blue-600 font-medium">BigCommerce Stores & Success Stories</a></li> 
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AboutPage
